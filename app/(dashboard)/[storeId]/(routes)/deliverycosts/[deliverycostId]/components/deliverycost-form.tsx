"use client"

import { IDeliveryCost } from '@/Models/Delivery'
import AlertModal from '@/components/modals/alert-modal'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import * as z from 'zod'

interface DeliveryFormProps {
    initialData: IDeliveryCost | null
}

const formSchema = z.object({
    category: z.string().min(1),
    priceTiers: z.array(
        z.object({
            min: z.string().min(1),
            max: z.string().min(1),
            price: z.string().min(1)
        })
    )
})

type DeliveryFormValues = z.infer<typeof formSchema>

export const DeliveryCostForm: React.FC<DeliveryFormProps> = ({
    initialData
}) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit Delivery Cost" : "Create Delivery Cost"
    const description = initialData ? "Edit a Delivery Cost" : "Add a new Delivery Cost"
    const toastMessage = initialData ? "Delivery Cost Updated." : "Delivery Cost Added."
    const action = initialData ? "Save Changes" : "Create"

    const form = useForm<DeliveryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            category: '',
            priceTiers: []
        }
    });

    const { fields: priceTierFields, append: appendPriceTier, remove: removePriceTier } = useFieldArray({
        control: form.control,
        name: 'priceTiers'
    });

    const onSubmit = async (data: DeliveryFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/deliverycosts/${params.deliverycostId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/deliverycosts`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/deliverycosts`)
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
            await axios.delete(`/api/${params.storeId}/deliverycosts/${params.deliverycostId}`)
            router.refresh()
            router.push(`/${params.storeId}/deliverycosts`)
            toast.success("Delivery Cost Deleted")
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
                            name='category'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category / Type </FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Koozies, Mugs, etc' {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

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
