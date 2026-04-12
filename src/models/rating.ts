import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IRating extends Document {
  resourceId: mongoose.Types.ObjectId;
  userId: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);

// one rating per user per resource
RatingSchema.index({ resourceId: 1, userId: 1 }, { unique: true });

const Rating = models.Rating || model<IRating>("Rating", RatingSchema);

export default Rating;
