import Joi from 'joi';

export const listingSchema= Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.object({
                filename:Joi.string().allow("",null),
                url:Joi.string().allow("",null),
        }),
        location:Joi.string().required(),
        country: Joi.string().required(),
        price:Joi.number().required().min(0),
        category: Joi.string()
    .valid(
    "Trending",
    "Rooms",
    "Iconic Cities",
    "Mountains",
    "Castles",
    "Amazing Pools",
    "Camping",
    "Farms",
    "Arctic",
    "domes",
    "Boats"
    )
    .required(),
    }).required()
});

export const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        review: Joi.string().required()
    }).required()
});