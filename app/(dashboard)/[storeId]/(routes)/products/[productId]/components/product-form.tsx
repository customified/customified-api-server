"use client"

import { category } from '@/Models/Category';
import { ICustomization } from '@/Models/Customization';
import { IUpgrade } from '@/Models/Upgrade';
import { IDeliveryCost } from '@/Models/Delivery';
import AlertModal from '@/components/modals/alert-modal';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Select from 'react-select';
import { Select as Selectt, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { IProduct } from '@/Models/Product';
import ImageUpload from '@/components/ui/image-upload';
import { IIndustry } from '@/Models/Industry';
import { Controller } from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'
import SingleImageUpload from '@/components/ui/single-image-upload';

interface ProductFormProps {
    initialData: IProduct;
    categories: category[];
    industries: IIndustry[];
    customizations: ICustomization[];
    upgrades: IUpgrade[];
    deliveryCosts: IDeliveryCost[];
}

const formSchema = z.object({
    name: z.string().min(1),
    categoryId: z.string().min(1),
    description: z.string().optional(),
    industries: z.array(
        z.object({
            _id: z.string().min(1),
            storeId: z.string().min(1),
            billboardId: z.string().min(1),
            name: z.string().min(1),
            image: z.string().min(1),
        })
    ),
    additionalCategories: z.array(z.string()).optional(),
    isFeatured: z.boolean().default(false),
    isArchived: z.boolean().default(false),
    customizations: z.array(
        z.object({
            _id: z.string().min(1),
            name: z.string().min(1),
            type: z.string().min(1),
            options: z.array(
                z.object({
                    _id: z.string().min(1),
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
    ),
    images: z.string().array(),
    upgrades: z.array(
        z.object({
            _id: z.string().min(1),
            name: z.string().min(1),
            mediaUrl: z.string().min(1),
            category: z.string().min(1),
            priceTiers: z.array(
                z.object({
                    min: z.string().min(1),
                    max: z.string().min(1),
                    price: z.string().min(1)
                })
            ),
            storeId: z.string().min(1)
        })
    ),
    stock: z.number().min(0),
    deliveryCostId: z.string().min(1)
});

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    industries,
    customizations,
    upgrades,
    deliveryCosts
}) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Product" : "Create Product";
    const description = initialData ? "Edit a Product" : "Add a new Product";
    const toastMessage = initialData ? "Product Updated." : "Product Created.";
    const action = initialData ? "Save Changes" : "Create";

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            categoryId: '',
            description: '',
            industries: [],
            additionalCategories: [],
            isFeatured: false,
            isArchived: false,
            customizations: [],
            images: [],
            upgrades: [],
            stock: 0,
            deliveryCostId: ''
        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);
            console.log(data)
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Product Deleted");
        } catch (error) {
            toast.error("Make sure to delete all related data");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const customizationSelectId = useId();



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
                                        <Input disabled={loading} placeholder='Product Name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='categoryId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Selectt
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Select a Category"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category: category) => (
                                                <SelectItem
                                                    key={category._id}
                                                    value={category._id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Selectt>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prodcut Description</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='describe..........' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name='industries'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Industries</FormLabel>
                                    <Select
                                        isDisabled={loading}
                                        isMulti
                                        onChange={options => field.onChange(options.map(option => option))}
                                        value={industries.filter(industry => field.value.some(fv => fv._id === industry._id))}
                                        getOptionLabel={(industry) => industry.name}
                                        getOptionValue={(industry) => industry._id}
                                        options={industries}
                                        placeholder="Select Industries"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="additionalCategories"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Categories</FormLabel>
                                    <Controller
                                        name="additionalCategories"
                                        control={form.control}
                                        render={({ field }) => (
                                            <CreatableSelect
                                                isDisabled={loading}
                                                isMulti
                                                onChange={(options) => field.onChange(options.map(option => option.value))}
                                                value={Array.isArray(field.value) ? field.value.map(value => ({ label: value, value })) : []}
                                                getOptionLabel={(option) => option.label}
                                                getOptionValue={(option) => option.value}
                                                options={[]} // No predefined options
                                                placeholder="Select or Create Additional Categories"
                                            />
                                        )}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name='customizations'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customizations</FormLabel>
                                    <Select
                                        inputId={customizationSelectId}
                                        isDisabled={loading}
                                        isMulti
                                        onChange={options => field.onChange(options.map(option => ({
                                            _id: option.value,
                                            name: option.label,
                                            type: customizations.find(c => c._id === option.value)?.type,
                                            options: customizations.find(c => c._id === option.value)?.options
                                        })))}
                                        value={field.value.map(fv => ({
                                            value: fv._id,
                                            label: fv.name
                                        }))}
                                        getOptionLabel={(customization) => customization.label}
                                        getOptionValue={(customization) => customization.value}
                                        options={customizations.map(c => ({
                                            value: c._id,
                                            label: c.name
                                        }))}
                                        placeholder="Select customizations"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        
                        <div className='col-span-3 flex gap-5 w-[100vw]'>
                            <FormField
                                control={form.control}
                                name='images'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Images</FormLabel>
                                        <FormControl>
                                            <SingleImageUpload
                                                value={field.value.map((url) => url)}
                                                disabled={loading}
                                                onChange={(url) => {field.onChange([...field.value, url])}}
                                                onRemove={(url) => field.onChange([...field.value.filter((currenturl) => currenturl !== url)])}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                     <div className="col-span-1 flex justify-evenly">
                        <FormField
                            control={form.control}
                            name='isFeatured'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Featured</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="checkbox"
                                            disabled={loading}
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='isArchived'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Archived</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="checkbox"
                                            disabled={loading}
                                            checked={field.value}
                                            onChange={e => field.onChange(e.target.checked)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>



                        <FormField
                            control={form.control}
                            name='upgrades'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upgrades</FormLabel>
                                    <Select
                                        isDisabled={loading}
                                        isMulti
                                        onChange={options => field.onChange(options.map(option => option))}
                                        value={upgrades.filter(upgrade => field.value.some(fv => fv._id === upgrade._id))}
                                        getOptionLabel={(upgrade) => `${upgrade.name}-${upgrade.category}`}
                                        getOptionValue={(upgrade) => upgrade._id}
                                        options={upgrades}
                                        placeholder="Select upgrades"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='stock'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            disabled={loading}
                                            placeholder='Stock'
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name='deliveryCostId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Delivery Cost</FormLabel>
                                    <Select
                                        isDisabled={loading}
                                        onChange={option => field.onChange(option ? option._id : '')}
                                        value={deliveryCosts.find(deliveryCost => deliveryCost._id === field.value) || null}
                                        getOptionLabel={(deliveryCost) => deliveryCost.category}
                                        getOptionValue={(deliveryCost) => deliveryCost._id}
                                        options={deliveryCosts}
                                        placeholder="Select a delivery cost"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <Button disabled={loading} type="submit">{action}</Button>
                </form>
            </Form>
        </>
    );
};
