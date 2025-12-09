// src/pages/CheckoutPage.jsx
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
} from "@mui/material";
import { useCartContext } from "../context/CartContext";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { cart, totalPrice } = useCartContext();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const emptyFields = {
    fullName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  };

  const [shippingInfo, setShippingInfo] = useState(emptyFields);
  const [billingInfo, setBillingInfo] = useState(emptyFields);

  const [hasStoredShipping, setHasStoredShipping] = useState(false);
  const [hasStoredBilling, setHasStoredBilling] = useState(false);

  const [addingNewShipping, setAddingNewShipping] = useState(false);
  const [addingNewBilling, setAddingNewBilling] = useState(false);

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  

  const addressFields = [
    "fullName",
    "phone",
    "address1",
    "address2",
    "city",
    "state",
    "zip",
    "country",
  ];

  /* ------------------------------------------------------------
     FETCH SAVED INFO
  -------------------------------------------------------------*/
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
        console.error("Error fetching checkout info:", err);
      }
    };
    fetchInfo();
  }, []);

  /* ------------------------------------------------------------
     INPUT HANDLERS
  -------------------------------------------------------------*/
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleBillingSame = () => {
    setBillingSameAsShipping(!billingSameAsShipping);
    setAddingNewBilling(false);
  };

  /* ------------------------------------------------------------
     SAVE INFO
  -------------------------------------------------------------*/
  const handleSaveInfo = async () => {
    try {
      if (!user) return alert("Please login first.");

      const billingToSave = billingSameAsShipping ? shippingInfo : billingInfo;

      await API.post("/user/saveCheckoutInfo", {
        shipping: shippingInfo,
        billing: billingToSave,
      });

      alert("Checkout info saved!");
      setHasStoredShipping(true);
      setHasStoredBilling(!billingSameAsShipping);
    } catch (err) {
      console.error("Save info error:", err);
      alert("Failed to save info.");
    }
  };

  /* ------------------------------------------------------------
     PLACE ORDER (GO TO PAYMENT PAGE)
  -------------------------------------------------------------*/
    const handlePlaceOrder = () => {
        try {
        if (!user) return alert("Please login first.");

        if (cart.length === 0) return alert("Your cart is empty.");

        const finalBilling = billingSameAsShipping ? shippingInfo : billingInfo;

        // Validate shipping info
        if (!shippingInfo.fullName || !shippingInfo.address1 || !shippingInfo.city || !shippingInfo.zip) {
            return alert("Please complete shipping address.");
        }

        // Validate billing info if different from shipping
        if (!billingSameAsShipping) {
            if (!billingInfo.fullName || !billingInfo.address1 || !billingInfo.city || !billingInfo.zip) {
            return alert("Please complete billing address.");
            }
        }

        const orderData = {
            cart,
            shipping: shippingInfo,
            billing: finalBilling,
            total: totalPrice + 50,
        };

        navigate("/payment", { state: { orderData } });
        } catch (err) {
        console.error("Place order error:", err);
        alert("Error preparing order. Please try again.");
        }
    };
  /* ------------------------------------------------------------
     RENDER ORDER SUMMARY
  -------------------------------------------------------------*/
  const renderOrderSummary = () => (
    <Card sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Order Summary
      </Typography>

      {cart.map((item) => (
        <Box
          key={item.productId._id}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            gap: 2,
          }}
        >
          <img
            src={item.productId.imageUrl || "/placeholder.png"}
            alt={item.productId.name}
            style={{
              width: 70,
              height: 70,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
          <Box>
            <Typography fontWeight={600}>{item.productId.name}</Typography>
            <Typography variant="body2">Qty: {item.quantity}</Typography>
            <Typography variant="body2" color="green">
              ${item.productId.price}
            </Typography>
          </Box>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" fontWeight={600}>
        Total: ${(totalPrice + 50).toFixed(2)}{" "}
        <Typography variant="body2" component="span">
          (incl. $50 shipping)
        </Typography>
      </Typography>
    </Card>
  );

  /* ------------------------------------------------------------
     RENDER
  -------------------------------------------------------------*/
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 5 }}>
      <Typography variant="h4" fontWeight={600} mb={4}>
        Checkout
      </Typography>

      {renderOrderSummary()}

      {/* SHIPPING */}
      <Typography variant="h5" fontWeight={600} mb={1}>
        Shipping Address
      </Typography>
      {hasStoredShipping && !addingNewShipping ? (
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
            <Button variant="contained">Use This Address</Button>
            <Button
              variant="outlined"
              onClick={() => {
                setAddingNewShipping(true);
                setShippingInfo(emptyFields);
              }}
            >
              Add New Address
            </Button>
          </Stack>
        </Card>
      ) : (
        <Card sx={{ p: 3, mb: 2 }}>
          <Stack spacing={2}>
            {addressFields.map((field) => (
              <TextField
                key={field}
                label={field.replace(/([A-Z])/g, " $1").toUpperCase()}
                name={field}
                value={shippingInfo[field]}
                onChange={handleShippingChange}
                fullWidth
              />
            ))}
          </Stack>
        </Card>
      )}

      {/* BILLING */}
      {!hasStoredBilling && (
        <FormControlLabel
          control={<Checkbox checked={billingSameAsShipping} onChange={handleToggleBillingSame} />}
          label="Billing address same as shipping"
          sx={{ mb: 2 }}
        />
      )}

      <Typography variant="h5" fontWeight={600} mb={1}>
        Billing Address
      </Typography>

      {hasStoredBilling && !addingNewBilling ? (
        <Card sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6">{billingInfo.fullName}</Typography>
          <Typography>{billingInfo.address1}</Typography>
          {billingInfo.address2 && <Typography>{billingInfo.address2}</Typography>}
          <Typography>
            {billingInfo.city}, {billingInfo.state} {billingInfo.zip}
          </Typography>
          <Typography>{billingInfo.country}</Typography>
          <Typography>Phone: {billingInfo.phone}</Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="contained">Use This Address</Button>
            <Button
              variant="outlined"
              onClick={() => {
                setAddingNewBilling(true);
                setBillingInfo(emptyFields);
                setBillingSameAsShipping(false);
              }}
            >
              Add New Billing Address
            </Button>
          </Stack>
        </Card>
      ) : (
        (!billingSameAsShipping || addingNewBilling) && (
          <Card sx={{ p: 3, mb: 2 }}>
            <Stack spacing={2}>
              {addressFields.map((field) => (
                <TextField
                  key={field}
                  label={field.replace(/([A-Z])/g, " $1").toUpperCase()}
                  name={field}
                  value={billingInfo[field]}
                  onChange={handleBillingChange}
                  fullWidth
                />
              ))}
            </Stack>
          </Card>
        )
      )}

      {/* BUTTONS */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
        <Button variant="outlined" onClick={handleSaveInfo}>
          Save Info
        </Button>
        <Button variant="contained" onClick={handlePlaceOrder}>
          Place Order ${(totalPrice + 50).toFixed(2)}
        </Button>
      </Stack>
    </Box>
  );
}
