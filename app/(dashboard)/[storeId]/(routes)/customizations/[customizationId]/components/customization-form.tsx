"use client"

import { ICustomization } from '@/Models/Customization'
import AlertModal from '@/components/modals/alert-modal'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import SingleImageUpload from '@/components/ui/single-image-upload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

interface CustomizationFormProps {
    initialData: ICustomization | null
}

const formSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    options: z.array(
        z.object({
            name: z.string().min(1),
            value: z.string().optional(),
            mediaUrl: z.string().optional(),
            prices: z.array(
                z.object({
                    min: z.string().min(1),
                    max: z.string().min(1),
                    price: z.string().min(1)
                })
            ).optional()
        })
    ).optional()
})

type CustomizationFormValues = z.infer<typeof formSchema>

export const CustomizationForm: React.FC<CustomizationFormProps> = ({
    initialData
}) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit Customization" : "Create Customization"
    const description = initialData ? "Edit a Customization" : "Add a new Customization"
    const toastMessage = initialData ? "Customization Updated." : "Customization Added."
    const action = initialData ? "Save Changes" : "Create"

    const form = useForm<CustomizationFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            type: '',
            options: []
        }
    });

    const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
        control: form.control,
        name: 'options'
    });

    const customizationOptions = ['Size', 'Color', 'Text', 'Quantity']

    const onSubmit = async (data: CustomizationFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/customizations/${params.customizationId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/customizations`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/customizations`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/customizations/${params.customizationId}`)
            router.refresh()
            router.push(`/${params.storeId}/customizations`)
            toast.success("Customization Deleted")
        } catch (error) {
            toast.error("Couldn't delete")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className='flex items-center justify-between'>
                <Heading
                    title={title}
                    description={description}
                />
                {initialData &&
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className='h-4 w-4' />
                    </Button>
                }
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product/ Category Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='neon can cooler, Mugs, Tshirt, etc...' {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='type'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type Of Customization</FormLabel>
                                    <FormControl>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select Type of Customization"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {customizationOptions.map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='space-y-4'>
                        {optionFields.map((option, optionIndex) => (
                            <div key={option.id} className='space-y-2 border p-4 rounded'>
                                <div className='flex items-center space-x-4'>
                                    <FormField
                                        control={form.control}
                                        name={`options.${optionIndex}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Option Name</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder='Option Name' {...field} required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`options.${optionIndex}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Option Value</FormLabel>
                                                <FormControl>
                                                    <Input disabled={loading} placeholder='Option Value' {...field}  />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name={`options.${optionIndex}.mediaUrl`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Upload Media</FormLabel>
                                            <FormControl>
                                                <SingleImageUpload
                                                    value={field.value ? [field.value] : []}
                                                    disabled={loading}
                                                    onChange={(url) => field.onChange(url)}
                                                    onRemove={() => field.onChange("")}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className='space-y-2'>
                                    {(form.watch(`options.${optionIndex}.prices`) || []).map((price, priceIndex) => (
                                        <div key={priceIndex} className='flex items-center space-x-4'>
                                            <FormField
                                                control={form.control}
                                                name={`options.${optionIndex}.prices.${priceIndex}.min`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Min Quantity</FormLabel>
                                                        <FormControl>
                                                            <Input disabled={loading} placeholder='Min Quantity' {...field} required />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`options.${optionIndex}.prices.${priceIndex}.max`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Max Quantity</FormLabel>
                                                        <FormControl>
                                                            <Input disabled={loading} placeholder='Max Quantity' {...field} required />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`options.${optionIndex}.prices.${priceIndex}.price`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Price</FormLabel>
                                                        <FormControl>
                                                            <Input disabled={loading} placeholder='Price' {...field} required />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                    <Button type='button' onClick={() => form.setValue(`options.${optionIndex}.prices`, [...(form.getValues(`options.${optionIndex}.prices`) || []), { min: '', max: '', price: '' }])}>
                                        Add Price
                                    </Button>
                                </div>
                                <Button type='button' onClick={() => removeOption(optionIndex)} variant='destructive'>
                                    Remove Option
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className='flex gap-5 justify-center w-fit'>
                        <Button type='button' onClick={() => appendOption({ name: '', value: '', mediaUrl: '', prices: [] })}>
                            Add Option
                        </Button>

                        <Button disabled={loading} className='ml-auto' type='submit'>
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}
