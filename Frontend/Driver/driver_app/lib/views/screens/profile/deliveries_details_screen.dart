import 'package:flutter/material.dart';
import '../../../models/order.dart';

class DeliveriesDetailScreen extends StatefulWidget {
  final Order order;

  const DeliveriesDetailScreen({super.key, required this.order});

  @override
  State<DeliveriesDetailScreen> createState() => _DeliveriesDetailScreenState();
}

class _DeliveriesDetailScreenState extends State<DeliveriesDetailScreen> {
  Widget _buildDetailRow(String label, String value, {IconData? icon}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          if (icon != null) Icon(icon, color: Colors.grey),
          if (icon != null) SizedBox(width: 8),
          Text(
            '$label: ',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(fontSize: 16),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Order Details'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Card(
          color: Colors.grey[200],
          elevation: 4,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 16),
                  _buildDetailRow('Client', widget.order.client?.name ?? 'Unknown Client', icon: Icons.person),
                  _buildDetailRow('Email', widget.order.client?.email ?? 'No email', icon: Icons.email),
                  _buildDetailRow('Origin', widget.order.origin, icon: Icons.location_on),
                  _buildDetailRow('Destination', widget.order.destination, icon: Icons.flag),
                  _buildDetailRow('Value', '€${widget.order.value?.toStringAsFixed(2) ?? '0.00'}', icon: Icons.euro),
                  _buildDetailRow('Status', widget.order.status ?? 'Unknown Status', icon: Icons.info),
                  _buildDetailRow('Description', widget.order.description ?? 'No description', icon: Icons.description),
                  _buildDetailRow('Feedback', widget.order.feedback ?? 'No feedback', icon: Icons.feedback),
                  _buildDetailRow('Category', widget.order.category, icon: Icons.category),
                  if (widget.order.width != null ||
                      widget.order.height != null ||
                      widget.order.length != null ||
                      widget.order.weight != null) ...[
                    SizedBox(height: 16),
                    Text(
                      'Dimensions:',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    if (widget.order.width != null) _buildDetailRow('Width', '${widget.order.width} cm'),
                    if (widget.order.height != null) _buildDetailRow('Height', '${widget.order.height} cm'),
                    if (widget.order.length != null) _buildDetailRow('Length', '${widget.order.length} cm'),
                    if (widget.order.weight != null) _buildDetailRow('Weight', '${widget.order.weight} kg'),
                  ],
                  if (widget.order.plate != null ||
                      widget.order.model != null ||
                      widget.order.brand != null) ...[
                    SizedBox(height: 16),
                    Text(
                      'Vehicle Details:',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    if (widget.order.plate != null) _buildDetailRow('Plate', widget.order.plate!),
                    if (widget.order.model != null) _buildDetailRow('Model', widget.order.model!),
                    if (widget.order.brand != null) _buildDetailRow('Brand', widget.order.brand!),
                  ],
                  if (widget.order.driver != null) ...[
                    SizedBox(height: 16),
                    Text(
                      'Driver Details:',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    _buildDetailRow('Name', widget.order.driver!.name, icon: Icons.person),
                    _buildDetailRow('Email', widget.order.driver!.email, icon: Icons.email),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
