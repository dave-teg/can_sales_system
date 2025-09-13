import React from 'react'
import { Card, CardContent, Typography, Stack, IconButton } from '@mui/material'
import { Delete, ContentCopy } from '@mui/icons-material'

  const capitalizeWords = (string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


const SingleItemCard = ({product, handleRemoveFromCart}) => {
  return (
    <Card
          variant="outlined"
          sx={{
            p: 0.7,
            borderRadius: "6px",
          }}
        >
          <CardContent
            sx={{
              padding: "8px",
              "&:last-child": {
                paddingBottom: "8px",
              },
            }}
          >
            <Stack direction="column" gap={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  {capitalizeWords(product.productName)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  x{product.quantity}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                  <IconButton size="small" sx={{ p: 0.5 }} onClick={() => handleRemoveFromCart(product.id)}>
                    <Delete fontSize="12px" />
                  </IconButton>

                <Typography variant="body1" fontWeight={600}>
                  ${product.price}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
  )
}

export default SingleItemCard