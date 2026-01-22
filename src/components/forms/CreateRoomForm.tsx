// src/components/forms/CreateRoomForm.tsx

import { UseFormReturn } from 'react-hook-form';
import z from 'zod';

const CreateRoomFormInput = z.object({});
function CreateRoomForm() {
    return function (form: UseFormReturn<CreateRoomFormInput>) {};
}
