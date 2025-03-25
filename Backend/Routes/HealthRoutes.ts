import express from "express";
import { authenticateUser, checkResourceOwnership } from "../Middleware/AuthMiddleware";
import { CreateHealthTracker, GetHealthTracker, UpdateHealthTracker, DeleteHealthTracker } from "../Controller/HealthTracker";
import { CreateWeightTracking, GetWeightTracking, UpdateWeightTracking, DeleteWeightTracking } from "../Controller/WeightTracking";
import { CreateMedicalRecord, GetMedicalRecord, UpdateMedicalRecord, DeleteMedicalRecord } from "../Controller/MedicalRecord";
import { CreateDietPlan, GetDietPlan, UpdateDietPlan, DeleteDietPlan } from "../Controller/DietPlan";
import validateRequest from "../Middleware/ValidationMiddleware";
import { healthTrackerSchema, weightTrackingSchema, medicalRecordSchema, dietPlanSchema } from "../Validation/HealthSchema";
import { authenticateVet } from "../Middleware/VetAuthMiddleware";

const router = express.Router();

// Health Tracker Routes
router.post(
  "/health-tracker",
  authenticateVet,
  validateRequest(healthTrackerSchema),
  CreateHealthTracker
);

router.get(
  "/health-tracker/:h_petProfile_id",
  authenticateUser,
  GetHealthTracker
);

router.put(
  "/health-tracker/:h_petProfile_id",
  authenticateUser,
  validateRequest(healthTrackerSchema),
  UpdateHealthTracker
);

router.delete(
  "/health-tracker/:h_petProfile_id",
  authenticateUser,
  DeleteHealthTracker
);

// Weight Tracking Routes
router.post(
  "/weight-tracking",
  authenticateUser,
  validateRequest(weightTrackingSchema),
  CreateWeightTracking
);

router.get(
  "/weight-tracking/:health_tracker_id",
  authenticateUser,
  GetWeightTracking
);

router.put(
  "/weight-tracking/:health_tracker_id",
  authenticateUser,
  validateRequest(weightTrackingSchema),
  UpdateWeightTracking
);

router.delete(
  "/weight-tracking/:health_tracker_id",
  authenticateUser,
  DeleteWeightTracking
);

// Medical Record Routes
router.post(
  "/medical-record",
  authenticateUser,
  validateRequest(medicalRecordSchema),
  CreateMedicalRecord
);

router.get(
  "/medical-record/:health_tracker_id",
  authenticateUser,
  GetMedicalRecord
);

router.put(
  "/medical-record/:health_tracker_id",
  authenticateUser,
  validateRequest(medicalRecordSchema),
  UpdateMedicalRecord
);

router.delete(
  "/medical-record/:health_tracker_id",
  authenticateUser,
  DeleteMedicalRecord
);

// Diet Plan Routes
router.post(
  "/diet-plan",
  authenticateUser,
  validateRequest(dietPlanSchema),
  CreateDietPlan
);

router.get(
  "/diet-plan/:health_tracker_id",
  authenticateUser,
  GetDietPlan
);

router.put(
  "/diet-plan/:health_tracker_id",
  authenticateUser,
  validateRequest(dietPlanSchema),
  UpdateDietPlan
);

router.delete(
  "/diet-plan/:health_tracker_id",
  authenticateUser,
  DeleteDietPlan
);

export default router; 