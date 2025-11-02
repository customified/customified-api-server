"use client"

import { billboard } from '@/Models/Billboard'
import { category } from '@/Models/Category'
import AlertModal from '@/components/modals/alert-modal'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import SingleImageUpload from '@/components/ui/single-image-upload'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import * as z from 'zod'


interface CategoryFormProps {
    initialData: category | null
    billboards: billboard[]
}

const formSchema = z.object({
    name: z.string().min(1),
    image: z.string().min(1),
    billboardId: z.string().min(1),
    product_description: z.array(z.object({ key: z.string().min(1), value: z.string().min(1) })).optional(),
    faq: z.array(z.object({ key: z.string().min(1), value: z.string().min(1) })).optional()
})

type CategoryFormValues = z.infer<typeof formSchema>

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {
    const params = useParams()
    const router = useRouter()
    // const origin = UseOrigin()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit Category" : "Create Category"
    const description = initialData ? "Edit a Category" : "Add a new Category"
    const toastMessage = initialData ? "Category Updated." : "Category Created."
    const action = initialData ? "Save Changes" : "Create"

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            image: '',
            billboardId: '',
            product_description: [],
            faq: []
        }
    });

    const { fields: productDescFields, append: appendProductDesc, remove: removeProductDesc } = useFieldArray({ control: form.control, name: 'product_description' })
    const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control: form.control, name: 'faq' })

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success("Category Deleted")
        } catch (error) {
            toast.error("make sure to delete all products in this category ")
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
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8 w-full'>
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Category Name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                             
                    <FormField
                        control={form.control}
                        name='image'
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

                        <FormField
                            control={form.control}
                            name='billboardId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                   
                                   <Select 
                                   disabled={loading} 
                                   onValueChange={field.onChange} 
                                   value={field.value} 
                                   defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                             defaultValue={field.value}
                                             placeholder="Select a billboard"
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {billboards.map((billboard : billboard)=>(
                                            <SelectItem
                                              key={billboard._id}
                                              value={billboard._id}
                                            >
                                                {billboard.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                   </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {/* Product Description Items */}
                        <div className="col-span-3">
                            <div className='flex items-center justify-between'>
                                <FormLabel>Product Description</FormLabel>
                                <Button type='button' variant='secondary' disabled={loading} onClick={() => appendProductDesc({ key: '', value: '' })}>Add Description Item</Button>
                            </div>
                            <div className='mt-2 space-y-4'>
                                {productDescFields.map((field, index) => (
                                    <div key={field.id} className='grid grid-cols-3 gap-4 items-end'>
                                        <FormField
                                            control={form.control}
                                            name={`product_description.${index}.key` as const}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Key</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={loading} placeholder='Key' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`product_description.${index}.value` as const}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Value</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={loading} placeholder='Value' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className='flex'>
                                            <Button type='button' variant='destructive' size='sm' disabled={loading} onClick={() => removeProductDesc(index)}>Remove</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ Items */}
                        <div className="col-span-3">
                            <div className='flex items-center justify-between'>
                                <FormLabel>FAQ</FormLabel>
                                <Button type='button' variant='secondary' disabled={loading} onClick={() => appendFaq({ key: '', value: '' })}>Add FAQ</Button>
                            </div>
                            <div className='mt-2 space-y-4'>
                                {faqFields.map((field, index) => (
                                    <div key={field.id} className='grid grid-cols-3 gap-4 items-end'>
                                        <FormField
                                            control={form.control}
                                            name={`faq.${index}.key` as const}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Question</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={loading} placeholder='Question' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`faq.${index}.value` as const}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Answer</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={loading} placeholder='Answer' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className='flex'>
                                            <Button type='button' variant='destructive' size='sm' disabled={loading} onClick={() => removeFaq(index)}>Remove</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}