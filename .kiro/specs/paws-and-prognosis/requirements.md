# Requirements Document

## Introduction

Paws & Prognosis is a mobile-first veterinary clinic appointment and care application built with React Native (Expo) and Supabase. The application serves two primary user roles: Pet Owners who book appointments, manage pet profiles, and communicate with veterinarians; and Veterinarians who manage their daily patient load, appointment calendar, vaccine inventory, and clinic reminders. The MVP centers on a streamlined "Book Now" flow where pet owners browse a vet's schedule, tap an open date, and confirm a booking that automatically surfaces on the Vet Dashboard.

## Glossary

- **Pet_Owner**: A registered user of the application who owns one or more pets and uses the app to book veterinary appointments, manage pet profiles, and communicate with veterinarians
- **Veterinarian**: A registered clinic staff member who uses the app to manage appointments, patient records, reminders, and communicate with pet owners
- **Appointment**: A scheduled veterinary visit linking a Pet_Owner, a pet, and a Veterinarian at a specific date and time
- **Pet_Profile**: A data record representing a pet, including name, species, breed, age, gender, weight, color, country, pet card number, sterilization date, and photo
- **Schedule_Strip**: A horizontal date selector UI component on the Vet Details screen that displays available appointment slots for a Veterinarian
- **Dashboard**: The Veterinarian's home screen displaying reminders, upcoming appointments, and finished appointment summaries
- **Booking_Confirmation**: A screen displayed to the Pet_Owner after successfully scheduling an appointment
- **Chat_Thread**: A real-time messaging conversation between a Pet_Owner and their assigned Veterinarian, powered by Supabase Realtime
- **Call_Screen**: A UI mockup screen simulating voice/video call controls (mic, hang-up, camera) without actual WebRTC functionality
- **Rating**: A post-visit feedback mechanism where a Pet_Owner rates the consultation using paw-shaped icons (1–5 scale)
- **Reminder**: A notification item on the Vet Dashboard alerting about today's vaccination appointments, expiring vaccine lots, or refrigerator temperature alerts
- **Category**: A service classification on the Home screen (Health, Grooming, Pet Food, Boarding) used to filter or browse veterinary services
- **Auth_Service**: The authentication subsystem powered by Supabase Auth supporting email/password and Google OAuth sign-in
- **Bottom_Tab_Navigator**: The primary navigation component with four tabs: Home, Calendar, Chat, and Profile

## Requirements

### Requirement 1: Pet Owner Authentication

**User Story:** As a Pet_Owner, I want to sign up and log in with email or Google OAuth, so that I can securely access my account and pet data.

#### Acceptance Criteria

1. WHEN a Pet_Owner submits a valid email and password on the Sign Up screen, THE Auth_Service SHALL create a new account and navigate the Pet_Owner to the Home screen
2. WHEN a Pet_Owner submits a valid email and password on the Log In screen, THE Auth_Service SHALL authenticate the user and navigate to the Home screen
3. WHEN a Pet_Owner taps the Google OAuth button in a development build, THE Auth_Service SHALL initiate Google sign-in and create or link the account upon successful authentication
4. IF a Pet_Owner submits an invalid email format or a password shorter than 6 characters, THEN THE Auth_Service SHALL display a descriptive validation error message on the respective input field
5. IF the Auth_Service receives invalid credentials during login, THEN THE Auth_Service SHALL display an error message indicating incorrect email or password
6. WHILE a Pet_Owner is authenticated, THE Auth_Service SHALL persist the session token in AsyncStorage so the user remains logged in across app restarts

### Requirement 2: Veterinarian Authentication

**User Story:** As a Veterinarian, I want to log in with my clinic credentials, so that I can access my dashboard and patient records.

#### Acceptance Criteria

1. WHEN a Veterinarian submits valid email and password on the Log In screen, THE Auth_Service SHALL authenticate the user and navigate to the Vet Dashboard
2. IF the Auth_Service receives invalid credentials during Veterinarian login, THEN THE Auth_Service SHALL display an error message indicating incorrect email or password
3. WHILE a Veterinarian is authenticated, THE Auth_Service SHALL persist the session token in AsyncStorage so the user remains logged in across app restarts
4. THE Auth_Service SHALL assign the correct user role (pet_owner or veterinarian) upon login to determine navigation routing

### Requirement 3: Home Screen and Vet Browsing

**User Story:** As a Pet_Owner, I want to browse available veterinarians and service categories on the home screen, so that I can find the right vet for my pet's needs.

#### Acceptance Criteria

1. WHEN the Pet_Owner navigates to the Home screen, THE Home_Screen SHALL display a promotional banner, category shortcuts (Health, Grooming, Pet Food, Boarding), and a grid of available Veterinarian cards
2. WHEN the Pet_Owner taps a Category shortcut, THE Home_Screen SHALL filter the displayed Veterinarian cards to show only those matching the selected Category
3. WHEN the Pet_Owner taps a Veterinarian card, THE Home_Screen SHALL navigate to the Vet Details screen for the selected Veterinarian
4. THE Home_Screen SHALL display each Veterinarian card with the vet's name, specialty, profile photo, and availability indicator

### Requirement 4: Vet Details and Appointment Booking

**User Story:** As a Pet_Owner, I want to view a vet's profile and available schedule, so that I can book an appointment with one tap.

#### Acceptance Criteria

1. WHEN the Pet_Owner navigates to the Vet Details screen, THE Vet_Details_Screen SHALL display the Veterinarian's name, specialty, profile photo, rating, and a Schedule_Strip showing available dates
2. WHEN the Pet_Owner taps an available date on the Schedule_Strip, THE Vet_Details_Screen SHALL highlight the selected date and display available time slots for that date
3. WHEN the Pet_Owner taps the "Book Now" button after selecting a date and time slot, THE Booking_System SHALL create an Appointment record in Supabase linking the Pet_Owner, selected pet, Veterinarian, date, and time
4. WHEN the Booking_System successfully creates an Appointment, THE Booking_System SHALL navigate the Pet_Owner to the Booking_Confirmation screen displaying appointment details
5. IF the Pet_Owner attempts to book an already-occupied time slot, THEN THE Booking_System SHALL display an error message indicating the slot is no longer available
6. WHEN a new Appointment is created by a Pet_Owner, THE Booking_System SHALL make the appointment visible on the Veterinarian's Dashboard within 5 seconds

### Requirement 5: Pet Profile Management

**User Story:** As a Pet_Owner, I want to manage profiles for all my pets with photos and health details, so that veterinarians have accurate information during visits.

#### Acceptance Criteria

1. WHEN the Pet_Owner navigates to the My Pets screen, THE Pet_Management_System SHALL display a gallery of all registered Pet_Profiles with thumbnails and names
2. WHEN the Pet_Owner taps "Add a Companion," THE Pet_Management_System SHALL display a form to enter pet details: name, species, breed, age, gender, weight, color, country, pet card number, and sterilization date
3. WHEN the Pet_Owner submits a valid Add Pet form, THE Pet_Management_System SHALL create a new Pet_Profile record in Supabase and display the pet in the gallery
4. WHEN the Pet_Owner taps the photo upload area on the Add Pet form, THE Pet_Management_System SHALL invoke expo-image-picker to allow selection from the device camera or photo gallery
5. WHEN the Pet_Owner selects an image via expo-image-picker, THE Pet_Management_System SHALL upload the image to Supabase Storage and associate the URL with the Pet_Profile
6. IF the Pet_Owner submits the Add Pet form with missing required fields (name, species, breed), THEN THE Pet_Management_System SHALL display validation errors on the respective fields
7. WHEN the Pet_Owner taps a pet in the gallery, THE Pet_Management_System SHALL navigate to the Pet Profile detail screen showing all pet statistics and information

### Requirement 6: Appointments Calendar (Pet Owner)

**User Story:** As a Pet_Owner, I want to view my appointments on a monthly calendar, so that I can track upcoming and past veterinary visits.

#### Acceptance Criteria

1. WHEN the Pet_Owner navigates to the Calendar tab, THE Calendar_Screen SHALL display a monthly calendar view using react-native-calendars with marked dates for all booked Appointments
2. WHEN the Pet_Owner taps a marked date on the calendar, THE Calendar_Screen SHALL display a list of Appointment cards for that date showing vet name, pet name, time, and status
3. THE Calendar_Screen SHALL visually distinguish between upcoming and past Appointments using different marker colors
4. WHEN a new Appointment is booked, THE Calendar_Screen SHALL reflect the new appointment on the calendar upon next navigation to the Calendar tab

### Requirement 7: In-App Chat

**User Story:** As a Pet_Owner, I want to message my assigned veterinarian in real-time, so that I can ask follow-up questions between visits.

#### Acceptance Criteria

1. WHEN the Pet_Owner navigates to the Chat tab, THE Chat_System SHALL display a list of Chat_Threads with the most recent message preview, timestamp, and Veterinarian name
2. WHEN the Pet_Owner taps a Chat_Thread, THE Chat_System SHALL display the full conversation history with messages ordered chronologically
3. WHEN the Pet_Owner sends a message in a Chat_Thread, THE Chat_System SHALL persist the message in Supabase and deliver it to the Veterinarian's chat view using Supabase Realtime
4. WHEN a new message is received from a Veterinarian, THE Chat_System SHALL display the message in the Pet_Owner's active Chat_Thread without requiring manual refresh
5. THE Chat_System SHALL display each message with sender identification, message text, and timestamp

### Requirement 8: In-App Call (UI Mockup)

**User Story:** As a Pet_Owner, I want to initiate a voice or video call with my veterinarian, so that I can have real-time consultations for urgent concerns.

#### Acceptance Criteria

1. WHEN the Pet_Owner taps the Call button on the Vet Details screen, THE Call_Screen SHALL display a call interface with microphone toggle, camera toggle, and hang-up controls
2. WHEN the Pet_Owner taps the microphone toggle, THE Call_Screen SHALL visually switch the microphone icon between muted and unmuted states
3. WHEN the Pet_Owner taps the camera toggle, THE Call_Screen SHALL visually switch between a "video on" and "no video" display state
4. WHEN the Pet_Owner taps the hang-up button, THE Call_Screen SHALL navigate to the End Call / Rating screen
5. THE Call_Screen SHALL display the Veterinarian's name and profile photo during the simulated call

### Requirement 9: Post-Visit Rating

**User Story:** As a Pet_Owner, I want to rate my veterinary consultation after it ends, so that I can provide feedback on the quality of care.

#### Acceptance Criteria

1. WHEN the Pet_Owner reaches the End Call / Rating screen, THE Rating_System SHALL display paw-shaped icons representing a 1-to-5 rating scale
2. WHEN the Pet_Owner taps a paw icon, THE Rating_System SHALL highlight all paw icons up to and including the selected rating value
3. WHEN the Pet_Owner submits a rating, THE Rating_System SHALL persist the rating in Supabase associated with the Appointment and Veterinarian
4. IF the Pet_Owner does not submit a rating and navigates away, THEN THE Rating_System SHALL not record any rating for that visit

### Requirement 10: Pet Owner Account and Settings

**User Story:** As a Pet_Owner, I want to manage my account information and app settings, so that I can keep my profile up to date and control my preferences.

#### Acceptance Criteria

1. WHEN the Pet_Owner navigates to the Profile tab, THE Account_Screen SHALL display the user's profile information, a list of registered pets, and settings options (payment methods, order history, notifications, privacy policy)
2. WHEN the Pet_Owner taps "Account Information," THE Account_Screen SHALL navigate to an editable profile form with name, email, phone number, and profile photo
3. WHEN the Pet_Owner taps "Log out," THE Account_Screen SHALL display a confirmation modal with the message "Leaving already?" and two options: "Stay" and "Log out"
4. WHEN the Pet_Owner confirms logout by tapping "Log out" on the modal, THE Auth_Service SHALL clear the session token from AsyncStorage and navigate to the Log In screen
5. WHEN the Pet_Owner taps "Stay" on the logout modal, THE Account_Screen SHALL dismiss the modal and remain on the Profile tab

### Requirement 11: Veterinarian Dashboard

**User Story:** As a Veterinarian, I want to see a personalized dashboard with reminders and appointment summaries, so that I can manage my daily workload efficiently.

#### Acceptance Criteria

1. WHEN the Veterinarian navigates to the Dashboard, THE Dashboard SHALL display a personalized greeting using the Veterinarian's name
2. WHEN the Veterinarian navigates to the Dashboard, THE Dashboard SHALL display a Reminders panel showing today's vaccination appointments, vaccine lots expiring within 7 days, and refrigerator temperature alerts
3. THE Dashboard SHALL display summary cards showing the count of upcoming Appointments and finished Appointments for the current day
4. WHEN a new Appointment is booked by a Pet_Owner, THE Dashboard SHALL reflect the updated appointment count within 5 seconds via Supabase Realtime

### Requirement 12: Veterinarian Today's Cases

**User Story:** As a Veterinarian, I want to view today's patient list with details, so that I can prepare for each appointment in advance.

#### Acceptance Criteria

1. WHEN the Veterinarian navigates to the Today's Cases screen, THE Cases_Screen SHALL display a list of all Appointments scheduled for the current date
2. THE Cases_Screen SHALL display each appointment item with the pet's thumbnail photo, pet name, owner name, and appointment time
3. WHEN the Veterinarian taps an appointment item, THE Cases_Screen SHALL navigate to the Patient Profile screen for the associated pet

### Requirement 13: Veterinarian Appointments Calendar

**User Story:** As a Veterinarian, I want to view all my appointments on a monthly calendar with day view, so that I can plan my schedule across multiple days.

#### Acceptance Criteria

1. WHEN the Veterinarian navigates to the Appointments tab, THE Vet_Calendar_Screen SHALL display a monthly calendar view using react-native-calendars with marked dates for all booked Appointments
2. WHEN the Veterinarian taps a date on the calendar, THE Vet_Calendar_Screen SHALL display a day view listing all Appointments for the selected date with pet name, owner name, and time
3. THE Vet_Calendar_Screen SHALL visually distinguish between upcoming, in-progress, and completed Appointments using different marker styles

### Requirement 14: Veterinarian Patient Profile

**User Story:** As a Veterinarian, I want to view and edit patient profiles, so that I can keep pet health records accurate and up to date.

#### Acceptance Criteria

1. WHEN the Veterinarian navigates to a Patient Profile, THE Patient_Profile_Screen SHALL display the pet's name, species, breed, age, gender, weight, color, country, pet card number, sterilization date, and photo
2. WHEN the Veterinarian taps the edit button on the Patient Profile, THE Patient_Profile_Screen SHALL enable editing of the following fields: status, color, country, pet card number, breed, and sterilization date
3. WHEN the Veterinarian saves edits to a Patient Profile, THE Patient_Profile_Screen SHALL persist the updated fields to Supabase and display a success confirmation
4. IF the Veterinarian submits the edit form with invalid data (empty required fields), THEN THE Patient_Profile_Screen SHALL display validation errors on the respective fields

### Requirement 15: Veterinarian Chat

**User Story:** As a Veterinarian, I want to message pet owners in real-time, so that I can provide follow-up care instructions and answer questions.

#### Acceptance Criteria

1. WHEN the Veterinarian navigates to the Chat tab, THE Chat_System SHALL display a list of Chat_Threads with pet owner names, most recent message preview, and timestamp
2. WHEN the Veterinarian taps a Chat_Thread, THE Chat_System SHALL display the full conversation history with messages ordered chronologically
3. WHEN the Veterinarian sends a message in a Chat_Thread, THE Chat_System SHALL persist the message in Supabase and deliver it to the Pet_Owner's chat view using Supabase Realtime
4. WHEN a new message is received from a Pet_Owner, THE Chat_System SHALL display the message in the Veterinarian's active Chat_Thread without requiring manual refresh

### Requirement 16: Veterinarian Account Settings

**User Story:** As a Veterinarian, I want to manage my account information, so that my clinic profile stays current.

#### Acceptance Criteria

1. WHEN the Veterinarian navigates to Account Settings, THE Vet_Account_Screen SHALL display the Veterinarian's name, role, email, and contact number
2. WHEN the Veterinarian taps "Log out," THE Vet_Account_Screen SHALL display a confirmation modal with "Stay" and "Log out" options
3. WHEN the Veterinarian confirms logout, THE Auth_Service SHALL clear the session token from AsyncStorage and navigate to the Log In screen

### Requirement 17: Navigation Structure

**User Story:** As a user (Pet_Owner or Veterinarian), I want consistent bottom tab navigation, so that I can move between app sections efficiently.

#### Acceptance Criteria

1. WHILE the Pet_Owner is authenticated, THE Bottom_Tab_Navigator SHALL display four tabs: Home, Calendar, Chat, and Profile
2. WHILE the Veterinarian is authenticated, THE Bottom_Tab_Navigator SHALL display four tabs: Dashboard, Appointments, Chat, and Account
3. THE Bottom_Tab_Navigator SHALL highlight the active tab with the app's green accent color
4. THE Bottom_Tab_Navigator SHALL use @expo/vector-icons for tab icons

### Requirement 18: Data Persistence

**User Story:** As a user, I want my data to persist reliably, so that I do not lose information between sessions or when the app is closed.

#### Acceptance Criteria

1. THE Auth_Service SHALL store authentication tokens in AsyncStorage to maintain sessions across app restarts
2. WHEN the Pet_Owner creates, updates, or deletes a Pet_Profile, THE Pet_Management_System SHALL persist the change to the Supabase PostgreSQL database within 3 seconds
3. WHEN the Booking_System creates an Appointment, THE Booking_System SHALL persist the appointment record to the Supabase PostgreSQL database immediately upon confirmation
4. IF a network error occurs during a data persistence operation, THEN THE application SHALL display an error message to the user indicating the operation could not be completed and suggest retrying

### Requirement 19: Splash Screen and App Loading

**User Story:** As a user, I want to see a branded splash screen while the app loads, so that I have a polished first impression and understand the app is starting.

#### Acceptance Criteria

1. WHEN the application is launched, THE Splash_Screen SHALL display the Paws & Prognosis logo and brand elements for a minimum of 2 seconds
2. WHILE the Splash_Screen is displayed, THE Auth_Service SHALL check for a valid persisted session token in AsyncStorage
3. WHEN the session check completes with a valid token, THE application SHALL navigate to the appropriate home screen based on user role (Home for Pet_Owner, Dashboard for Veterinarian)
4. WHEN the session check completes with no valid token, THE application SHALL navigate to the Log In screen

### Requirement 20: UI Design Consistency

**User Story:** As a user, I want a visually consistent and appealing interface, so that the app feels professional and easy to use.

#### Acceptance Criteria

1. THE application SHALL use a cream/beige background color palette with green accent for call-to-action buttons across all screens
2. THE application SHALL render card components with rounded corners and subtle shadow elevation
3. THE application SHALL display decorative paw-shaped ellipses and cat/dog illustrations on relevant screens as per the design system
4. THE application SHALL render all screens within a 430px width viewport optimized for standard mobile devices
