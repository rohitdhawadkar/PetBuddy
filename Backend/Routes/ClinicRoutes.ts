import { Router, Request, Response, NextFunction } from "express";
import v from "../Middleware/ValidationMiddleware";
import { authenticateAdmin } from "../Middleware/AdminAuthMiddleware";
import { authenticateVet } from "../Middleware/VetAuthMiddleware";
import {
  CreateClinic,
  GetClinic,
  GetAllClinics,
  UpdateClinic,
  DeleteClinic,
} from "../Controller/ClinicController";
import {
  CreateWorkingHours,
  GetVetWorkingHours,
  UpdateWorkingHours,
  DeleteWorkingHours,
} from "../Controller/WorkingHoursController";
import {
  CreateAppointment,
  GetAppointment,
  UpdateAppointment,
  DeleteAppointment,
} from "../Controller/AppointmentController";
import {
  createClinicSchema,
  updateClinicSchema,
  clinicIdParamSchema,
  createWorkingHoursSchema,
  updateWorkingHoursSchema,
  workingHoursIdParamSchema,
  vetIdParamSchema,
  createAppointmentSchema,
  updateAppointmentSchema,
  appointmentIdParamSchema,
  CreateClinicInput,
  UpdateClinicInput,
  ClinicIdParam,
  CreateWorkingHoursInput,
  UpdateWorkingHoursInput,
  WorkingHoursIdParam,
  VetIdParam,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentIdParam,
} from "../Validation/ClinicSchema";

const router: Router = Router();

// Clinic Routes - Admin only
router.post(
  "/create-clinic",
  authenticateAdmin,
  v(createClinicSchema),
  (req: Request<{}, {}, CreateClinicInput>, res: Response, next: NextFunction) => {
    CreateClinic(req, res).catch(next);
  }
);

router.get(
  "/get-clinic/:id",
  authenticateAdmin,
  v(clinicIdParamSchema),
  (req: Request<ClinicIdParam>, res: Response, next: NextFunction) => {
    GetClinic(req, res).catch(next);
  }
);

router.get(
  "/get-clinics",
  authenticateAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    GetAllClinics(req, res).catch(next);
  }
);

router.put(
  "/update-clinic/:id",
  authenticateAdmin,
  v(updateClinicSchema),
  v(clinicIdParamSchema),
  (req: Request<ClinicIdParam, {}, UpdateClinicInput>, res: Response, next: NextFunction) => {
    UpdateClinic(req, res).catch(next);
  }
);

router.delete(
  "/delete-clinic/:id",
  authenticateAdmin,
  v(clinicIdParamSchema),
  (req: Request<ClinicIdParam>, res: Response, next: NextFunction) => {
    DeleteClinic(req, res).catch(next);
  }
);

// Working Hours Routes - Vet only
router.post(
  "/working-hours",
  authenticateVet,
  v(createWorkingHoursSchema),
  (req: Request<{}, {}, CreateWorkingHoursInput>, res: Response, next: NextFunction) => {
    CreateWorkingHours(req, res).catch(next);
  }
);

router.get(
  "/working-hours/:vetId",
  authenticateVet,
  v(vetIdParamSchema),
  (req: Request<VetIdParam>, res: Response, next: NextFunction) => {
    GetVetWorkingHours(req, res).catch(next);
  }
);

router.put(
  "/working-hours/:id",
  authenticateVet,
  v(updateWorkingHoursSchema),
  v(workingHoursIdParamSchema),
  (req: Request<WorkingHoursIdParam, {}, UpdateWorkingHoursInput>, res: Response, next: NextFunction) => {
    UpdateWorkingHours(req, res).catch(next);
  }
);

router.delete(
  "/working-hours/:id",
  authenticateVet,
  v(workingHoursIdParamSchema),
  (req: Request<WorkingHoursIdParam>, res: Response, next: NextFunction) => {
    DeleteWorkingHours(req, res).catch(next);
  }
);

// Appointment Routes - Vet only
router.post(
  "/appointments",
  authenticateVet,
  v(createAppointmentSchema),
  (req: Request<{}, {}, CreateAppointmentInput>, res: Response, next: NextFunction) => {
    CreateAppointment(req, res).catch(next);
  }
);

router.get(
  "/appointments/:appointment_id",
  authenticateVet,
  v(appointmentIdParamSchema),
  (req: Request<AppointmentIdParam>, res: Response, next: NextFunction) => {
    GetAppointment(req, res).catch(next);
  }
);

router.put(
  "/appointments/:appointment_id",
  authenticateVet,
  v(updateAppointmentSchema),
  v(appointmentIdParamSchema),
  (req: Request<AppointmentIdParam, {}, UpdateAppointmentInput>, res: Response, next: NextFunction) => {
    UpdateAppointment(req, res).catch(next);
  }
);

router.delete(
  "/appointments/:appointment_id",
  authenticateVet,
  v(appointmentIdParamSchema),
  (req: Request<AppointmentIdParam>, res: Response, next: NextFunction) => {
    DeleteAppointment(req, res).catch(next);
  }
);

export default router; 