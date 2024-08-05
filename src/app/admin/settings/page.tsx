'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSession, signIn } from 'next-auth/react';

const formSchema = z.object({
  username: z.string().min(2, 'Nom d’utilisateur invalide'),
  email: z.string().email('Adresse email invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .optional(),
  confirmPassword: z
    .string()
    .min(6, 'La confirmation du mot de passe doit contenir au moins 6 caractères')
    .optional(),
  lastName: z.string().min(2, 'Nom invalide'),
  firstName: z.string().min(2, 'Prénom invalide'),
  phoneNumber: z
    .string()
    .min(10, 'Numéro de téléphone invalide')
    .refine(data => data.startsWith('+212'), {
      message: 'Le numéro de téléphone doit commencer par +212',
    }),
  picture: z.any().refine(file => file instanceof File && file.size > 0, 'Veuillez sélectionner une image').optional(),
}).refine(data => data.password === data.confirmPassword || !data.password, {
  path: ['confirmPassword'],
  message: 'Les mots de passe ne correspondent pas',
});

interface FormData {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  picture?: File | null; // Make it nullable
}

const uploadImage = async (image: File) => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Erreur lors du téléchargement de l\'image');
  }

  const data = await response.json();
  return data.secure_url;
};

export default function Settings(): JSX.Element {
  const { data: session } = useSession();
  const [userPhoneError, setuserPhoneError] = React.useState<string | null>(null);
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: session?.user?.username || '',
      email: session?.user?.email || '',
      firstName: session?.user?.firstName || '',
      lastName: session?.user?.lastName || '',
      phoneNumber: session?.user?.phoneNumber || '',
      picture: null,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setuserPhoneError(null);

      // Check if the phone number already exists
      const checkPhoneResponse = await fetch('/api/seller/checkPhoneNumber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: data.phoneNumber }),
      });

      if (checkPhoneResponse.status === 400) {
        setuserPhoneError('Le numéro de téléphone est déjà pris');
        return;
      }

      // Upload the image if there's a new one
      const imageUrl = data.picture ? await uploadImage(data.picture) : session?.user?.avatarImage;

      // Prepare data for updating
      const updateData = {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        avatarImage: imageUrl,
      };

      // Make the request to update user information
      const response = await fetch('/api/seller', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des informations');
      }

      const result = await response.json();

      // Update the session on the client side
      if (result.user) {
        // Force session refresh
        await signIn('credentials', { redirect: false, ...result.user });
        console.log('User updated and session refreshed');
      }
    } catch (e) {
      console.error('Erreur lors de la soumission du formulaire:', e);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      form.setValue('picture', event.target.files[0]); // Set file in form state manually
    }
  };

  const togglePasswordChange = () => {
    setIsPasswordChangeEnabled(prev => !prev);
    if (!isPasswordChangeEnabled) {
      // Clear password fields if password change is disabled
      form.setValue('password', '');
      form.setValue('confirmPassword', '');
    }
  };

  return (
    <div className="flex items-center justify-center  p-4 md:p-0">
      <div className="w-full max-w-4xl p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-8">
            <div className="flex flex-wrap -mx-4">
              {/* Left Column */}
              <div className="w-full md:w-1/2 px-4 space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d’utilisateur</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom d’utilisateur" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.lastName?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input placeholder="Prénom" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.firstName?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="Numéro de Téléphone" {...field} />
                      </FormControl>
                      <FormMessage>{form.formState.errors.phoneNumber?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} className="w-full" />
                      </FormControl>
                      <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="w-full md:w-1/2 px-4 space-y-4">
                {isPasswordChangeEnabled && (
                  <>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de Passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Mot de Passe" {...field} />
                          </FormControl>
                          <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le Mot de Passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirmer le Mot de Passe" {...field} />
                          </FormControl>
                          <FormMessage>{form.formState.errors.confirmPassword?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <FormField
                  control={form.control}
                  name="picture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image de Profil</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </FormControl>
                      <FormMessage>{form.formState.errors.picture?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Display userPhoneError message */}
            {userPhoneError && <FormMessage>{userPhoneError}</FormMessage>}
            <Button type="button" onClick={togglePasswordChange} className="w-full">
              {isPasswordChangeEnabled ? 'Annuler la modification du mot de passe' : 'Modifier le mot de passe'}
            </Button>
            <Button type="submit" className="w-full">
              Mettre à jour
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
