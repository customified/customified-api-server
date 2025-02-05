 // Start of Selection
"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IOrder } from "@/Models/Order";
import Image from "next/image";

interface OrderDetailsModalProps {
  order: IOrder;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order }) => {
  const [open, setOpen] = useState(false);

  //console.log("order", order);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Details
      </Button>
      <Modal
        title="Order Details"
        description="Full information about the order"
        isOpen={open}
        onClose={() => setOpen(false)}
      >
            <div className="space-y-6">

              {order?.orderItems?.map((item) => (
                <div key={item.product.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                      <Image
                        src={item.product?.image }
                        alt={item.product.name}
                        width={200}
                        height={200}
                        className="w-full object-cover rounded"
                      />
                      {item.product.design?.front?.userdesign && (
                        <div className="mt-2">
                          <p className="text-sm">Custom Design</p>
                          <Image
                            src={item.product.design.front.userdesign}
                            alt="Custom Design"
                            className="mt-2 w-full object-cover rounded"
                            width={200}
                            height={200}
                        />
                        </div>
                      )}
                    </div>
                    
                    <div className="w-full md:w-2/3 space-y-2">
                      <h3 className="text-lg font-semibold">{item.product.name}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm">Category: {item.product.category || 'N/A'}</p>
                        <p className="text-sm">Size: {item.product.productSize || 'N/A'}</p>
                        <p className="text-sm">Quantity: {item.product.quantity || 0}</p>
                        <p className="text-sm">Unit Cost: ${item.product.unitCost || '0.00'}</p>
                        {/* <p className="text-sm">Total Cost: ${item.product.totalCost || '0.00'}</p> */}
                        <p className="text-sm">Colors: {Object.entries(item.product.quantities || {}).map(([color, qty]) => `${color} (${qty})`).join(', ') || 'N/A'}</p>
                      </div>

                      {item.product.upgrades && Object.values(item.product.upgrades).map((upgrade: any) => (
                        <div key={upgrade._id} className="mt-2 p-2 bg-gray-50 rounded">
                          <p className="text-sm font-medium">{upgrade.name}</p>
                          <p className="text-xs text-gray-600">{upgrade.category}</p>
                        </div>
                      ))}

                      {item.product.design?.front?.textproperties && item.product.design.front.textproperties.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Custom Text:</p>
                          {item.product.design.front.textproperties.map((text: any, index: number) => (
                            <p key={index} className="text-xs">
                              {text.text} - {text.fontFamily} ({text.fill})
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
      </Modal>
    </>
  );
};