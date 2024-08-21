import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { IContact } from "../types/Contact.interface";
import APIFeatures from "../utils/APIFeatures";
import AppError from "../utils/AppError";
import { filterObj } from "../utils/Helper";
const Contact = require("../models/Contact.model");

export const createContact = catchAsync(async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    contactType,
    country,
    location,
  } = req.body;

  const contact: IContact = await Contact.create({
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    email: email,
    contactType: contactType,
    country: country,
    location: location,
  });

  res.status(201).json({
    status: true,
    message: "Contact created successfully",
    contact,
  });
});

export const getAllContacts = catchAsync(
  async (req: Request, res: Response) => {
    const contactsQuery = new APIFeatures(Contact.find(), req.query)
      .sort()
      .fields()
      .filter()
      .paginate();

    const contacts = await contactsQuery.query;

    res.status(200).json({
      status: true,
      message: "Contacts retrieved successfully",
      data: {
        contacts,
      },
    });
  }
);

export const getOneContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(new AppError("Contact not found", 404));
    }

    res.json({
      status: true,
      message: "Contact retrieved successfully",
      data: {
        contact,
      },
    });
  }
);

export const updateContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return next(new AppError("Contact not found", 404));
    }

    const filterObjects = filterObj(
      req.body,
      "firstName",
      "lastName",
      "phoneNumer",
      "email"
    );

    const newContact = await Contact.findByIdAndUpdate(
      contact.id,
      filterObjects,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      status: true,
      message: "Contact updated successfully",
      data: {
        newContact,
      },
    });
  }
);

export const deleteContact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return next(new AppError("Contact not found", 404));
    }

    res.status(200).json({
      status: true,
      message: "Contact deleted successfully",
    });
  }
);
