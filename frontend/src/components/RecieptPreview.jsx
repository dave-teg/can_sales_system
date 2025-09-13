import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Table, 
  TableBody, 
  TableCell, 
  TableRow, 
  Button,
  Grid
} from '@mui/material';
import { Print, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'

const order = {
  invoice_number: "BK20240058",  // 8-digit format you wanted
  created_at: new Date().toISOString(),
  user: {
    username: "Cashier_12"
  },
  items: [
    {
      id: 1,
      quantity: 2,
      unit_price: 5.99,
      product: {
        name: "WHOPPER JR"
      }
    },
    {
      id: 2,
      quantity: 1,
      unit_price: 3.49,
      product: {
        name: "FRIES (MED)"
      }
    },
    {
      id: 3,
      quantity: 1,
      unit_price: 1.89,
      product: {
        name: "COKE (MED)"
      }
    },
    {
      id: 4,
      quantity: 1,
      unit_price: 2.49,
      product: {
        name: "ONION RINGS"
      }
    }
  ],
  total_price: 15.35, // Before tax
  // Calculated values (can be computed if needed)
  tax: 1.23, // 8% tax example
  grand_total: 16.58
};

const ReceiptPreview = () => {
  const navigate = useNavigate()
  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      {/* Receipt Paper */}
      <Box sx={{ 
        width: '80mm', 
        minHeight: '200mm', 
        p: 2,
        border: '1px solid #eee',
        background: 'white',
        '@media print': {
          border: 'none',
          minHeight: 'auto'
        }
      }}>
        {/* Header */}
        <Typography variant="h6" align="center" fontWeight="bold" gutterBottom>
          BURGER KING
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Store #12345
        </Typography>
        <Typography variant="body2" align="center" paragraph>
          123 Main St, Anytown
        </Typography>

        <Divider sx={{ my: 1, borderWidth: 2 }} />

        {/* Order Info */}
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Order #</strong></Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" align="right">
              {order.invoice_number}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Date</strong></Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" align="right">
              {new Date(order.created_at).toLocaleDateString()}
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Time</strong></Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" align="right">
              {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 1 }} />

        {/* Items */}
        <Table size="small">
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ border: 'none', p: 0.5 }}>
                  <Typography fontWeight="bold">{item.quantity}x</Typography>
                </TableCell>
                <TableCell sx={{ border: 'none', p: 0.5 }}>
                  <Typography>{item.product.name}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ border: 'none', p: 0.5 }}>
                  <Typography>${(item.quantity * item.unit_price).toFixed(2)}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 1 }} />

        {/* Totals */}
        <Box sx={{ textAlign: 'right', mb: 2 }}>
          <Typography variant="body2">
            Subtotal: ${order.total_price.toFixed(2)}
          </Typography>
          <Typography variant="body2">
            Tax: ${(order.total_price * 0.08).toFixed(2)}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Total: ${(order.total_price * 1.08).toFixed(2)}
          </Typography>
        </Box>

        <Divider sx={{ my: 1, borderWidth: 2 }} />

        {/* Footer */}
        <Typography variant="caption" align="center" display="block" gutterBottom>
          Thank you for your visit!
        </Typography>
        <Typography variant="caption" align="center" display="block">
          Scan receipt for survey
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          {/* Placeholder for QR/Barcode */}
          <Box sx={{ 
            width: 100, 
            height: 100, 
            bgcolor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="caption">[QR CODE]</Typography>
          </Box>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ 
        position: 'fixed',
        bottom: 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        '@media print': {
          display: 'none'
        }
      }}>
        <Button 
          variant="contained" 
          startIcon={<Print />}
          onClick={() => window.print()}
          size="large"
        >
          Print Receipt
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/pos')}
          size="large"
        >
          Back to POS
        </Button>
      </Box>
    </Box>
  );
};

export default ReceiptPreview;