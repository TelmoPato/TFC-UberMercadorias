// login_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import 'package:teste_2/views/screens/auth/register_screen.dart';
import 'package:teste_2/views/screens/home/home_screen.dart';
import '../../../api/auth_api.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;

  void _attemptLogin(BuildContext context) async {
    setState(() {
      _isLoading = true;
    });
//mudado
    if (_emailController.text.isEmpty) {
      setState(() {
        _isLoading = false;
      });
      _showErrorDialog(context,"All fields must be filled");
      return; // Impede que o login continue se o email não for preenchido
    }

    if (_passwordController.text.isEmpty) {
      setState(() {
        _isLoading = false;
      });
      _showErrorDialog(context,"All fields must be filled");
      return; // Impede que o login continue se a senha não for preenchida
    }
//mudado
    final authApi = Provider.of<AuthApi>(context, listen: false);
    String? token = await authApi.login(_emailController.text, _passwordController.text);

    setState(() {
      _isLoading = false;
    });

    if (token != null) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => const HomeScreen()),
            (Route<dynamic> route) => false,
      );
    } else {
      _showErrorDialog(context, "Failed to login. Please try again.");
    }
  }



  void _showErrorDialog(BuildContext context,String message) {
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
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: MediaQuery.of(context).size.height * 0.2),
            SvgPicture.asset('assets/images/logo-svg.svg', height: 150),
            const SizedBox(height: 30),
            _buildTextField(_emailController, 'E-mail', Icons.email),
            const SizedBox(height: 16),
            _buildTextField(_passwordController, 'Password', Icons.lock, isObscure: true),
            const SizedBox(height: 24),
            _isLoading ? const CircularProgressIndicator() : _buildLoginButton(context),
            _buildRegisterButton(context),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hintText, IconData icon, {bool isObscure = false}) {
    return TextField(
      controller: controller,
      obscureText: isObscure,
      decoration: InputDecoration(
        hintText: hintText,
        prefixIcon: Icon(icon),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
        filled: true,
        fillColor: Colors.grey[200],
      ),
    );
  }

  Widget _buildLoginButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () => _attemptLogin(context),
        style: ElevatedButton.styleFrom(
          foregroundColor: Colors.white,
          backgroundColor: Colors.black,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
        child: const Text('Sign in'),
      ),
    );
  }

  Widget _buildRegisterButton(BuildContext context) {
    return TextButton(
      onPressed: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const RegisterScreen()),
        );
      },
      child: const Text('Do not have an account? Register here.', style: TextStyle(color: Colors.black54)),
    );
  }
}
