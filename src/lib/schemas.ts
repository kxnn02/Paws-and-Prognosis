import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿĀ-žñÑ\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email is too long'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password is too long'),
  role: z.enum(['pet_owner', 'veterinarian']),
});

export const signUpFormSchema = signUpSchema.extend({
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name cannot be empty')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-ZÀ-ÖØ-öø-ÿĀ-žñÑ\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  phone: z
    .string()
    .max(13, 'Phone number is too long')
    .regex(/^(\+63[0-9]{10})?$/, 'Phone must be in +63XXXXXXXXXX format (PH mobile)')
    .optional()
    .or(z.literal('')),
});

export const PET_SPECIES_OPTIONS = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Other'] as const;
export type PetSpecies = typeof PET_SPECIES_OPTIONS[number];
export const PET_GENDER_OPTIONS = ['Male', 'Female', 'Unknown'] as const;
export type PetGender = typeof PET_GENDER_OPTIONS[number];

export const petSchema = z.object({
  name: z.string().min(1, 'Pet name is required').max(50, 'Name is too long'),
  species: z.string().min(1, 'Please select a species').refine(
    (val) => (PET_SPECIES_OPTIONS as readonly string[]).includes(val),
    { message: 'Please select a valid species' }
  ),
  breed: z.string().min(1, 'Breed is required').max(50, 'Breed is too long'),
  age: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const num = Number(val);
        return !isNaN(num) && Number.isInteger(num) && num >= 0 && num <= 30;
      },
      { message: 'Age must be a whole number between 0 and 30' }
    ),
  gender: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        return (PET_GENDER_OPTIONS as readonly string[]).includes(val);
      },
      { message: 'Please select a valid gender' }
    ),
  weight: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const num = Number(val);
        return !isNaN(num) && num > 0 && num <= 200;
      },
      { message: 'Weight must be a number between 0.1 and 200 kg' }
    ),
  color: z.string().max(30, 'Color description is too long').optional().or(z.literal('')),
});

export const bookingSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time slot is required'),
  petId: z.string().nullable(),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional().or(z.literal('')),
});

export const rescheduleSchema = z.object({
  date: z.string().min(1, 'New date is required'),
  time: z.string().min(1, 'New time is required'),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignUpFormSchemaData = z.infer<typeof signUpFormSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type EditProfileFormData = z.infer<typeof editProfileSchema>;
export type PetFormData = z.infer<typeof petSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type RescheduleFormData = z.infer<typeof rescheduleSchema>;
