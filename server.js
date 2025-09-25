const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const PERFECTPAY_API_TOKEN = process.env.PERFECTPAY_API_TOKEN;
const PERFECTPAY_WEBHOOK_TOKEN = process.env.PERFECTPAY_WEBHOOK_TOKEN;

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { numbers, unit_price } = req.body;
    const total = numbers.length * unit_price;

    const response = await fetch("https://app.perfectpay.com.br/api/v1/sales/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PERFECTPAY_API_TOKEN}`,
      },
      body: JSON.stringify({
        sale_amount: total,
        custom_payload: { numbers }
      }),
    });

    const data = await response.json();
    return res.json({ url: data.checkoutUrl || "https://checkout.perfectpay.com/..." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar checkout" });
  }
});

app.post("/webhook/perfectpay", (req, res) => {
  const payload = req.body;

  if (payload.token !== PERFECTPAY_WEBHOOK_TOKEN) {
    return res.status(403).json({ error: "Token inválido" });
  }

  console.log("Webhook PerfectPay recebido:", payload);

  if (payload.sale_status_enum === 2) {
    console.log("✅ Venda aprovada:", payload.code);
  }

  return res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Backend rodando na porta", PORT));