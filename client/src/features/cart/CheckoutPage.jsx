import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Card,
  Divider,
  Snackbar,
  Alert,
  Container,
  Collapse,
} from "@mui/material";
import { useCartContext } from "./CartContext";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

const AddressForm = ({ data, onChange }) => {
  const fields = [
    "fullName",
    "phone",
    "address1",
    "address2",
    "city",
    "state",
    "zip",
    "country",
  ];
  return (
    <Stack spacing={2}>
      {fields.map((field) => (
        <TextField
          key={field}
          label={field.replace(/([A-Z])/g, " $1").toUpperCase()}
          name={field}
          value={data[field]}
          onChange={onChange}
          fullWidth
        />
      ))}
    </Stack>
  );
};

export default function CheckoutPage() {
  const { cart, totalPrice } = useCartContext();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const emptyFields = { fullName: "", phone: "", address1: "", address2: "", city: "", state: "", zip: "", country: "" };

  const [shippingInfo, setShippingInfo] = useState(emptyFields);
  const [billingInfo, setBillingInfo] = useState(emptyFields);

  const [hasStoredShipping, setHasStoredShipping] = useState(false);
  const [hasStoredBilling, setHasStoredBilling] = useState(false);

  const [editingShipping, setEditingShipping] = useState(false);
  const [editingBilling, setEditingBilling] = useState(false);

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  /* ------------------ FETCH STORED INFO ------------------ */
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) return;
        setUser(JSON.parse(savedUser));

        const res = await API.get("/user/checkout-info");

        if (res.data.shipping?.fullName) {
          setShippingInfo(res.data.shipping);
          setHasStoredShipping(true);
        }
        if (res.data.billing?.fullName) {
          setBillingInfo(res.data.billing);
          setHasStoredBilling(true);
          setBillingSameAsShipping(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchInfo();
  }, []);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    if (billingSameAsShipping) setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleBillingSame = () => {
    setBillingSameAsShipping(!billingSameAsShipping);
    if (!billingSameAsShipping) setBillingInfo(shippingInfo);
  };

  const handleSaveInfo = async () => {
    if (!user) return setSnackbar({ open: true, message: "Please login first", severity: "warning" });
    try {
      await API.post("/user/saveCheckoutInfo", {
        shipping: shippingInfo,
        billing: billingSameAsShipping ? shippingInfo : billingInfo,
      });
      setSnackbar({ open: true, message: "Checkout info saved!", severity: "success" });
      setHasStoredShipping(true);
      setHasStoredBilling(!billingSameAsShipping);
      setEditingShipping(false);
      setEditingBilling(false);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to save info.", severity: "error" });
    }
  };

  const handlePlaceOrder = () => {
    if (!user) return setSnackbar({ open: true, message: "Please login first", severity: "warning" });
    if (cart.length === 0) return setSnackbar({ open: true, message: "Your cart is empty", severity: "warning" });

    const requiredFields = ["fullName", "address1", "city", "zip"];
    for (let field of requiredFields) {
      if (!shippingInfo[field])
        return setSnackbar({ open: true, message: "Please complete shipping address", severity: "warning" });
      if (!billingSameAsShipping && !billingInfo[field])
        return setSnackbar({ open: true, message: "Please complete billing address", severity: "warning" });
    }

    const finalBilling = billingSameAsShipping ? shippingInfo : billingInfo;
    const orderData = { cart, shipping: shippingInfo, billing: finalBilling, total: totalPrice + 50 };
    navigate("/payment", { state: { orderData } });
  };

  /* ------------------ ORDER SUMMARY ------------------ */
  const renderOrderSummary = () => (
    <Card sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Order Summary
      </Typography>
      {cart.map((item) => (
        <Box key={item.productId._id} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
          <img
            src={item.productId.imageUrl || "/placeholder.svg"}
            alt={item.productId.name}
            onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.svg"; }}
            style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 8 }}
          />
          <Box>
            <Typography fontWeight={600}>{item.productId.name}</Typography>
            <Typography variant="body2">Qty: {item.quantity}</Typography>
            <Typography variant="body2" color="green">${item.productId.price}</Typography>
          </Box>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" fontWeight={600}>
        Total: ${(totalPrice + 50).toFixed(2)}{" "}
        <Typography variant="body2" component="span">(incl. $50 shipping)</Typography>
      </Typography>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={600} mb={4}>
        Checkout
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="flex-start">
        <Box flex={2}>
          {renderOrderSummary()}

          {/* SHIPPING */}
          <Typography variant="h5" fontWeight={600} mb={1}>
            Shipping Address
          </Typography>

          {hasStoredShipping && !editingShipping ? (
            <Card sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6">{shippingInfo.fullName}</Typography>
              <Typography>{shippingInfo.address1}</Typography>
              {shippingInfo.address2 && <Typography>{shippingInfo.address2}</Typography>}
              <Typography>
                {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
              </Typography>
              <Typography>{shippingInfo.country}</Typography>
              <Typography>Phone: {shippingInfo.phone}</Typography>
              <Stack direction="row" spacing={2} mt={2}>
                <Button variant="contained" onClick={() => setEditingShipping(true)}>Edit</Button>
              </Stack>
            </Card>
          ) : (
            <Card sx={{ p: 3, mb: 2 }}>
              <AddressForm data={shippingInfo} onChange={handleShippingChange} />
            </Card>
          )}

          {/* BILLING */}
          <FormControlLabel
            control={<Checkbox checked={billingSameAsShipping} onChange={handleToggleBillingSame} />}
            label="Billing address same as shipping"
            sx={{ mb: 2 }}
          />

          {!billingSameAsShipping && (
            <Collapse in={!billingSameAsShipping || editingBilling}>
              <Card sx={{ p: 3, mb: 2 }}>
                {hasStoredBilling && !editingBilling ? (
                  <Box>
                    <Typography variant="h6">{billingInfo.fullName}</Typography>
                    <Typography>{billingInfo.address1}</Typography>
                    {billingInfo.address2 && <Typography>{billingInfo.address2}</Typography>}
                    <Typography>
                      {billingInfo.city}, {billingInfo.state} {billingInfo.zip}
                    </Typography>
                    <Typography>{billingInfo.country}</Typography>
                    <Typography>Phone: {billingInfo.phone}</Typography>
                    <Stack direction="row" spacing={2} mt={2}>
                      <Button variant="contained" onClick={() => setEditingBilling(true)}>Edit</Button>
                    </Stack>
                  </Box>
                ) : (
                  <AddressForm data={billingInfo} onChange={handleBillingChange} />
                )}
              </Card>
            </Collapse>
          )}

          {/* BUTTONS */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end" mt={3}>
            <Button variant="outlined" onClick={handleSaveInfo}>
              Save Info
            </Button>
            <Button variant="contained" onClick={handlePlaceOrder}>
              Place Order ${(totalPrice + 50).toFixed(2)}
            </Button>
          </Stack>
        </Box>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
