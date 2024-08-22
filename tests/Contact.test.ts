const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const MongoMemoryServer = require("mongodb-memory-server");
const Contact = require("../models/Contact.model");

let mongoServer = new MongoMemoryServer();

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Contact API", () => {
  afterEach(async () => {
    await Contact.deleteMany({});
  });

  describe("POST /contacts", () => {
    it("should create a new contact", async () => {
      const newContact = {
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
        email: "john@example.com",
        contactType: "personal",
        country: "USA",
        location: "New York",
      };

      const response = await request(app).post("/contacts").send(newContact);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe(true);
      expect(response.body.contact.firstName).toBe(newContact.firstName);
    });
  });

  describe("PATCH /contacts/:id", () => {
    it("should update an existing contact", async () => {
      const contact = await Contact.create({
        firstName: "Jane",
        lastName: "Doe",
        phoneNumber: "0987654321",
        email: "jane@example.com",
        contactType: "personal",
        country: "USA",
        location: "Los Angeles",
      });

      const updates = {
        firstName: "Jane Updated",
        lastName: "Doe Updated",
        phoneNumber: "1111111111",
      };

      const response = await request(app)
        .patch(`/contacts/${contact.id}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.data.newContact.firstName).toBe(updates.firstName);
    });

    it("should return 404 if the contact is not found", async () => {
      const response = await request(app)
        .patch("/contacts/invalidContactId")
        .send({
          firstName: "NotFound",
        });

      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
    });
  });
});
