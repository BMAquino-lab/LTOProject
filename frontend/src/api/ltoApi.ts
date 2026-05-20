// frontend/src/api/ltoApi.ts
// Matches bridge.py endpoints exactly. All routes use POST with JSON body.

const BASE_URL = '/api'; // works with Vite proxy (recommended)
// If not using Vite proxy, use: const BASE_URL = 'http://localhost:5000/api';

type ApiResponse = {
  success?: boolean;
  data?: unknown;
  deleted?: number | boolean;
  error?: string;
  message?: string;
  details?: unknown;
};

function getErrorMessage(json: ApiResponse, status: number): string {
  if (json.error) return json.error;

  if (json.details && typeof json.details === 'object' && 'error' in json.details) {
    const detailError = (json.details as { error?: unknown }).error;
    if (typeof detailError === 'string') {
      return json.message ? `${json.message}: ${detailError}` : detailError;
    }
  }

  if (typeof json.details === 'string') {
    return json.message ? `${json.message}: ${json.details}` : json.details;
  }

  return json.message ?? `Request failed: ${status}`;
}

async function readJsonResponse(res: Response): Promise<ApiResponse> {
  const text = await res.text();
  if (!text) {
    return { error: `Empty response from server (${res.status})` };
  }

  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

async function post<T = unknown>(path: string, body: object = {}): Promise<{ success: boolean; data?: T; error?: string }> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await readJsonResponse(res);
  if (!res.ok || !json.success) {
    throw new Error(getErrorMessage(json, res.status));
  }
  return json as { success: boolean; data?: T; error?: string };
}

async function get<T = unknown>(path: string): Promise<{ success: boolean; data?: T; error?: string }> {
  const res = await fetch(`${BASE_URL}${path}`);
  const json = await readJsonResponse(res);
  if (!res.ok || !json.success) {
    throw new Error(getErrorMessage(json, res.status));
  }
  return json as { success: boolean; data?: T; error?: string };
}

// ─── TYPES (based on lto.sql schema) ────────────────────────────────────────

export interface Driver {
  license_number: string;
  full_name: string;
  address: string;
  license_type: string;
  sex: string;
  date_of_birth: string;
  date_issued: string;
  date_expired: string;
  license_status: string;
}

export interface Vehicle {
  plate_number: string;
  engine_number: string;
  chassis_number: string;
  vehicle_type: string;
  make: string;
  model: string;
  color: string;
  year_manufactured: number;
  owner: string | null;
}

export interface VehicleRegistration {
  registration_number: number;
  registration_date: string;
  expiration_date: string;
  registration_status: string;
  history: string;
  plate_number: string;
  license_number: string;
}

export interface TrafficViolation {
  violation_ticket_num: number;
  violation_date: string;
  violation_type: string;
  location: string;
  violation_status: string;
  apprehending_officer: string;
  fine_amount: number;
  license_number: string | null;
  plate_number: string | null;
}

export interface DriverFilters {
  license_number?: string;
  full_name?: string;
  address?: string;
  license_type?: string;
  license_status?: string;
  sex?: string;
  date_of_birth?: string;
  age_value?: number;
  age_op?: string;
}

export interface VehicleFilters {
  plate_number?: string;
  engine_number?: string;
  chassis_number?: string;
  vehicle_type?: string;
  make?: string;
  model?: string;
  color?: string;
  year_manufactured?: number;
  owner?: string;
}

export interface RegistrationFilters {
  registration_number?: number;
  plate_number?: string;
  registration_status?: string;
  registration_date?: string;
  expiration_date?: string;
  license_number?: string;
  history?: string;
}

export interface ViolationFilters {
  violation_ticket_num?: number;
  violation_date?: string;
  violation_type?: string;
  location?: string;
  violation_status?: string;
  apprehending_officer?: string;
  fine_amount?: number;
  license_number?: string;
  plate_number?: string;
}

export type ReportRow = Record<string, string | number | null>;

// ─── VEHICLES ────────────────────────────────────────────────────────────────

export const vehicleApi = {
  find: (selected_columns: string[] = [], filters: VehicleFilters = {}) =>
    post<Vehicle[]>('/vehicles/search', { selected_columns, filters }),

  insert: (data: Omit<Vehicle, 'owner'> & { owner?: string }) =>
    post('/vehicles/add', { data }),

  update: (updates: Partial<Vehicle>, filters: VehicleFilters) =>
    post('/vehicles/edit', { updates, filters }),

  delete: (plate_number: string) =>
    post('/vehicles/delete', { plate_number }),
};

// ─── VEHICLE REGISTRATIONS ────────────────────────────────────────────────────

export const registrationApi = {
  find: (selected_columns: string[] = [], filters: RegistrationFilters = {}) =>
    post<VehicleRegistration[]>('/registrations/search', { selected_columns, filters }),

  insert: (data: { plate_number: string; license_number: string }) =>
    post('/registrations/add', { data }),

  updateRegistration: (registration_number: number, data: Partial<VehicleRegistration>) =>
    post('/registrations/renew', { registration_number, data }),

  expireRegistrations: () =>
    post('/registrations/check-expiration'),

  updateOwner: (plate_number: string, new_license_number: string) =>
    post('/registrations/change-owner', { plate_number, new_license_number }),

  findOwner: (plate_number: string) =>
    post<{ full_name: string; license_number: string; plate_number: string }>(
      '/registrations/owner-lookup',
      { plate_number }
    ),

  delete: (registration_number: number) =>
    post('/registrations/delete', { registration_number }),
};

// ─── DRIVERS ─────────────────────────────────────────────────────────────────

export const driverApi = {
  find: (selected_columns: string[] = [], filters: DriverFilters = {}) =>
    post<Driver[]>('/drivers/search', { selected_columns, filters }),

  insert: (data: Omit<Driver, 'date_issued' | 'date_expired' | 'license_status'>) =>
    post('/drivers/add', { data }),

  update: (updates: Partial<Driver>, filters: { license_number?: string; full_name?: string; date_expired?: string }) =>
    post('/drivers/edit', { updates, filters }),

  expireLicenses: () =>
    post('/drivers/check-expired-licenses'),

  findVehicles: (license_number: string) =>
    post<Vehicle[]>('/drivers/owned-vehicles', { license_number }),

  findNonOwners: () =>
    get<Pick<Driver, 'full_name' | 'license_number'>[]>('/drivers/non-owners'),

  delete: (license_number: string) =>
    post('/drivers/delete', { license_number }),
};

// ─── TRAFFIC VIOLATIONS ───────────────────────────────────────────────────────

export const violationApi = {
  find: (selected_columns: string[] = [], filters: ViolationFilters = {}) =>
    post<TrafficViolation[]>('/violations/search', { selected_columns, filters }),

  insert: (data: {
    violation_type: string;
    location: string;
    apprehending_officer: string;
    fine_amount: number;
    license_number: string;
    plate_number: string;
  }) => post('/violations/file-ticket', { data }),

  updateStatus: (violation_ticket_num: number, new_status: string) =>
    post('/violations/update-status', { violation_ticket_num, new_status }),

  delete: (violation_ticket_num: number) =>
    post('/violations/delete', { violation_ticket_num }),

  countByDriver: (license_number: string) =>
    post<{ full_name: string; violation_count: number }>(
      '/violations/report-by-driver',
      { license_number }
    ),

  countByVehicle: (plate_number: string) =>
    post<{ owner_name: string; plate_number: string; violation_count: number }>(
      '/violations/report-by-vehicle',
      { plate_number }
    ),
};

export const reportApi = {
  registeredDrivers: (filters: {
    license_type?: string;
    license_status?: string;
    sex?: string;
    min_age?: number;
    max_age?: number;
  }) => post<ReportRow[]>('/reports/registered-drivers', { filters }),

  vehiclesByDriver: (license_number: string) =>
    post<ReportRow[]>('/reports/vehicles-by-driver', { license_number }),

  expiredRegistrations: (as_of_date: string) =>
    post<ReportRow[]>('/reports/expired-registrations', { as_of_date }),

  problemLicenses: () =>
    post<ReportRow[]>('/reports/problem-licenses'),

  violationsByDriverRange: (license_number: string, start_date: string, end_date: string) =>
    post<ReportRow[]>('/reports/violations-by-driver-range', { license_number, start_date, end_date }),

  violationTypeTotals: (year: number) =>
    post<ReportRow[]>('/reports/violation-type-totals', { year }),

  vehiclesInViolationsByArea: (area: string) =>
    post<ReportRow[]>('/reports/vehicles-in-violations-by-area', { area }),
};
