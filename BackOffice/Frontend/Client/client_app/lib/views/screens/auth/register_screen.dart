import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Adicione a dependência 'intl' ao seu pubspec.yaml
import 'package:provider/provider.dart';
import 'package:teste_2/views/screens/auth/login_screen.dart';
import '../../../api/auth_api.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../home/home_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _birthdateController = TextEditingController();
  final TextEditingController _phoneNumberController = TextEditingController();
  final TextEditingController _taxPayerNumberController = TextEditingController();
  final TextEditingController _streetController = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _postalCodeController = TextEditingController();

  bool _isLoading = false;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _birthdateController.dispose();
    _phoneNumberController.dispose();
    _taxPayerNumberController.dispose();
    _streetController.dispose();
    _cityController.dispose();
    _postalCodeController.dispose();
    super.dispose();
  }




  String formatAddress(String street, String city) {
    String fullAddress = "$street, $city"; // Junta rua e cidade
    return Uri.encodeComponent(fullAddress); // Converte para URL-safe
  }


  Future<bool> isValidStreet(String street) async {
    String street = _streetController.text;
    String city = _cityController.text;

    String formattedAddress = formatAddress(street, city);
    String url = "https://nominatim.openstreetmap.org/search?q=$formattedAddress&format=json";

    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.isNotEmpty; // Se houver resultados, a rua é válida
    }
    return false; // Retorna false se a API falhar
  }

  Widget _buildDateField({
    required BuildContext context,
    required TextEditingController controller,
    required String label,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: GestureDetector(
        onTap: () => _selectDate(context, controller),
        child: AbsorbPointer(
          child: _buildTextField(
            controller: controller,
            label: label,
          ),
        ),
      ),
    );
  }

  Future<void> _selectDate(BuildContext context, TextEditingController controller) async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (pickedDate != null) {
      final String formattedDate = DateFormat('yyyy-MM-dd').format(pickedDate);
      controller.text = formattedDate;
    }
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    TextInputType keyboardType = TextInputType.text,
    bool obscureText = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextFormField(
        controller: controller,
        decoration: InputDecoration(
          labelText: label,
          fillColor: Colors.white,
          filled: true,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(4.0),
          ),
          labelStyle: TextStyle(
            color: Colors.grey[800],
            fontSize: 16.0,
          ),
        ),
        keyboardType: keyboardType,
        obscureText: obscureText,
        style: const TextStyle(color: Colors.black, fontSize: 18.0),
      ),
    );
  }

  void _attemptRegister(BuildContext context) async {
    setState(() {
      _isLoading = true;
    });

    // Mapeia os controladores e os nomes dos campos
    final fields = {
      'Name': _nameController.text,
      'Email': _emailController.text,
      'Birthdate': _birthdateController.text,
      'Password': _passwordController.text,
      'Phone Number': _phoneNumberController.text,
      'Tax Payer Number': _taxPayerNumberController.text,
      'Street': _streetController.text,
      'City': _cityController.text,
      'Postal Code': _postalCodeController.text,
    };

    // Verifica se algum campo está vazio
    for (var entry in fields.entries) {
      if (entry.value.isEmpty) {
        setState(() {
          _isLoading = false;
        });
        _showErrorDialog(context, "Please fill all fields");
        return;
      }
    }

    if (_phoneNumberController.text.length != 9) {
      _showErrorDialog(context, "Phone number must contain exactly 9 digits.");
      setState(() {
        _isLoading = false;
      });
      return;
    }

    // Verifica se a string contém apenas números
    if (!RegExp(r'^[0-9]+$').hasMatch(_phoneNumberController.text)) {
      _showErrorDialog(context, "Phone number must contain only numbers.");
      setState(() {
        _isLoading = false;
      });
      return;
    }

    if (_taxPayerNumberController.text.length != 9) {
      _showErrorDialog(context, "TaxPayerNumber must contain exactly 9 digits.");
      setState(() {
        _isLoading = false;
      });
      return;
    }

    if (!RegExp(r'^[0-9]+$').hasMatch(_taxPayerNumberController.text)) {
      _showErrorDialog(context, "TaxPayerNumber must contain only numbers.");
      setState(() {
        _isLoading = false;
      });
      return;
    }

    if (!await isValidStreet(_streetController.text)) {
      _showErrorDialog(context, "Invalid street address.");
      setState(() {
        _isLoading = false;
      });
      return;
    }


    final Map<String, dynamic> registrationData = {
      'name': _nameController.text,
      'email': _emailController.text,
      'birthdate': _birthdateController.text,
      'password': _passwordController.text,
      'phoneNumber': _phoneNumberController.text,
      'taxPayerNumber': int.parse(_taxPayerNumberController.text),
      'street': _streetController.text,
      'city': _cityController.text,
      'postalCode': _postalCodeController.text,
    };

    final authProvider = Provider.of<AuthApi>(context, listen: false);
    bool registrationSuccess = await authProvider.registerClient(registrationData);

    setState(() {
      _isLoading = false;
    });

    if (registrationSuccess) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => const LoginScreen()),
            (Route<dynamic> route) => false,
      );
    } else {
      _showErrorDialog(context,"Failed to register. Please try again.");
    }
  }

  void _showErrorDialog(context,String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Error'),
          content: Text(message),
          actions: [
            TextButton(
              child: const Text('OK'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      appBar: AppBar(
        title: const Text('Register', style: TextStyle(color: Colors.black)),
        backgroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              _buildTextField(
                controller: _nameController,
                label: 'Name',
              ),
              _buildDateField(
                context: context,
                controller: _birthdateController,
                label: 'Birthdate',
              ),
              _buildTextField(
                controller: _emailController,
                label: 'Email',
                keyboardType: TextInputType.emailAddress,
              ),
              _buildTextField(
                controller: _passwordController,
                label: 'Password',
                obscureText: true,
              ),
              _buildTextField(
                controller: _phoneNumberController,
                label: 'Phone Number',
                keyboardType: TextInputType.phone,
              ),
              _buildTextField(
                controller: _taxPayerNumberController,
                label: 'Tax Payer Number',
                keyboardType: TextInputType.number,
              ),
              _buildTextField(
                controller: _streetController,
                label: 'Street',
              ),
              _buildTextField(
                controller: _cityController,
                label: 'City',
              ),
              _buildTextField(
                controller: _postalCodeController,
                label: 'Postal Code',
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _isLoading ? null : () => _attemptRegister(context),
                style: ElevatedButton.styleFrom(
                  foregroundColor: Colors.white,
                  backgroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30.0),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                )
                    : const Text('Register'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
