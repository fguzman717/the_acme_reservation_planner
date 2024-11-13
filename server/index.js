// Import functions from db.js
const {
  client,
  createTables,
  createCustomers,
  createRestaurants,
  fetchCustomers,
  fetchRestaurants,
  createReservations,
  fetchReservations,
  destroyReservations,
} = require("./db");

// Import express and set up the app
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// Start the express server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// Routes
// GET customers
app.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (error) {
    next(error);
  }
});

// GET restaurants
app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (error) {
    next(error);
  }
});

// GET reservations
app.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (error) {
    next(error);
  }
});

// POST reservations
app.post("/api/customers/:customer_id/reservations", async (req, res, next) => {
  try {
    res.status(201).send(
      await createReservations({
        customer_id: req.params.customer_id,
        restaurant_id: req.body.restaurant_id,
        party_count: req.body.party_count,
        date: req.body.date,
      })
    );
  } catch (error) {
    next(error);
  }
});

// DELETE reservations
app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      await destroyReservations({
        id: req.params.id,
        customer_id: req.params.customer_id,
      });
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// Error Handling Route
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({ error: error.message || error });
});

// Initialization
const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");
  const [larry, moe, curly, texasRoadhouse, cheesecakeFactory, glorias] =
    await Promise.all([
      createCustomers({ name: "Larry" }),
      createCustomers({ name: "Moe" }),
      createCustomers({ name: "Curly" }),
      createRestaurants({ name: "Texas Roadhouse" }),
      createRestaurants({ name: "Cheesecake Factory" }),
      createRestaurants({ name: "Gloria's" }),
    ]);

  const [reservation, reservation2, reservation3, reservation4] =
    await Promise.all([
      createReservations({
        customer_id: larry.id,
        restaurant_id: cheesecakeFactory.id,
        party_count: "3",
        date: "1/11/2025",
      }),
      createReservations({
        customer_id: moe.id,
        restaurant_id: texasRoadhouse.id,
        party_count: "3",
        date: "2/11/2025",
      }),
      createReservations({
        customer_id: curly.id,
        restaurant_id: glorias.id,
        party_count: "3",
        date: "3/11/2025",
      }),
      createReservations({
        customer_id: larry.id,
        restaurant_id: cheesecakeFactory.id,
        party_count: "3",
        date: "4/11/2025",
      }),
    ]);
};

init();
