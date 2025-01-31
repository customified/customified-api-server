"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname()
    const params = useParams()
    const routes = [
        {
            href: `/${params.storeId}`,
            label: "Overview",
            active: pathname === `/${params.storeId}`
        },
        {
            href: `/${params.storeId}/orders`,
            label: "Orders",
            active: pathname === `/${params.storeId}/orders`
        },
        {
            href: `/${params.storeId}/billboards`,
            label: "Billboards",
            active: pathname === `/${params.storeId}/billboards`
        },
        {
            href: `/${params.storeId}/categories`,
            label: "Categories",
            active: pathname === `/${params.storeId}/categories`
        },
        {
            href: `/${params.storeId}/industries`,
            label: "Industries",
            active: pathname === `/${params.storeId}/industries`
        },
        {
            href: `/${params.storeId}/customizations`,
            label: "Customizations",
            active: pathname === `/${params.storeId}/customizations`
        },
        {
            href: `/${params.storeId}/upgrades`,
            label: "Upgrades",
            active: pathname === `/${params.storeId}/upgrades`
        },
        {
            href: `/${params.storeId}/deliverycosts`,
            label: "Delivery costs",
            active: pathname === `/${params.storeId}/deliverycosts`
        },
        {
            href: `/${params.storeId}/products`,
            label: "Products",
            active: pathname === `/${params.storeId}/products`
        },
        {
            href: `/${params.storeId}/settings`,
            label: "Settings",
            active: pathname === `/${params.storeId}/settings`
        }]

    return (

        <nav
            className={cn("flex items-center space-x-4 lg:spaace-x-6", className)}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn
                        ("text-sm font-medium transition-colors hover:text-primary",
                            route.active ? "text-black dark:text-white" : "text-muted-foreground"
                        )}>
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}