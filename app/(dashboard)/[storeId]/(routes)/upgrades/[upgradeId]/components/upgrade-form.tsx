"use client"

import { IUpgrade } from '@/Models/Upgrade'
import AlertModal from '@/components/modals/alert-modal'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import SingleImageUpload from '@/components/ui/single-image-upload'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import * as z from 'zod'

interface UpgradeFormProps {
    initialData: IUpgrade | null
}

const formSchema = z.object({
    name: z.string().min(1),
    mediaUrl: z.string().min(1),
    category: z.string().min(1),
    priceTiers: z.array(
        z.object({
            min: z.string().min(1),
            max: z.string().min(1),
            price: z.string().min(1)
        })
    )
})

type UpgradeFormValues = z.infer<typeof formSchema>

export const UpgradeForm: React.FC<UpgradeFormProps> = ({
    initialData
}) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit Upgrade" : "Create Upgrade"
    const description = initialData ? "Edit an Upgrade" : "Add a new Upgrade"
    const toastMessage = initialData ? "Upgrade Updated." : "Upgrade Added."
    const action = initialData ? "Save Changes" : "Create"

    const form = useForm<UpgradeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            mediaUrl: '',
            category: '',
            priceTiers: []
        }
    });

    const { fields: priceTierFields, append: appendPriceTier, remove: removePriceTier } = useFieldArray({
        control: form.control,
        name: 'priceTiers'
    });

    const onSubmit = async (data: UpgradeFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/upgrades/${params.upgradeId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/upgrades`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/upgrades`)
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
            await axios.delete(`/api/${params.storeId}/upgrades/${params.upgradeId}`)
            router.refresh()
            router.push(`/${params.storeId}/upgrades`)
            toast.success("Upgrade Deleted")
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
                                    <FormLabel>Upgrade Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Eg. Individual Packaging' {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='category'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type/Name of Product</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Koozies, Mugs, Etc....' {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                            control={form.control}
                            name='mediaUrl'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
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


                    <div className='space-y-4'>
                        {priceTierFields.map((tier, index) => (
                            <div key={tier.id} className='space-y-2 border p-4 rounded'>
                                <div className='flex items-center space-x-4'>
                                    <FormField
                                        control={form.control}
                                        name={`priceTiers.${index}.min`}
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
                                        name={`priceTiers.${index}.max`}
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
                                        name={`priceTiers.${index}.price`}
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
                                <Button type='button' onClick={() => removePriceTier(index)} variant='destructive'>
                                    Remove Price Tier
                                </Button>
                            </div>
                        ))}
                        <Button type='button' onClick={() => appendPriceTier({ min: '', max: '', price: '' })}>
                            Add Price Tier
                        </Button>
                    </div>

                    <div className=''>
                        <Button disabled={loading} className='ml-auto' type='submit'>
                            {action}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}
