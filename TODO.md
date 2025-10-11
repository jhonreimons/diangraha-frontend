# TODO: Fix Edit Service API

## Steps to Complete
- [x] Add PUT method to app/api/services/[id]/route.ts for updating a specific service
- [x] Update AddServiceForm.tsx to call PUT to /api/services/${editId} for edit mode and remove id from formData
- [x] Remove PUT method from app/api/services/route.ts as edit is now handled in [id]/route.ts
- [x] Test the edit functionality to ensure no more HTTP 500 error
