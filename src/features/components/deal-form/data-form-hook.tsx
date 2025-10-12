"use client";

import { useDebounce } from "@/lib/debouncer";
import { dealsService } from "@/services";
import { DealDto } from "@definitions/dto";
import CreateDealRequest from "@definitions/requests/create-deal";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

type MeasurementUnit = "тонна" | "куб.м" | "шт";
type PaymentMethod = "наличный расчет" | "безналичный расчет";
type ReceivingMethod = "самовывоз" | "доставка";

const roundWithDecimals = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

const calculateTotal = (
  quantity: number,
  pricePerUnit: number,
  amountSale: number,
  deliveryPrice: number = 0
) => {
  const amountPurchase = quantity * pricePerUnit;
  const companyProfit = amountSale - amountPurchase;
  const totalAmount = amountSale + deliveryPrice;
  const managerProfit = roundWithDecimals(companyProfit * 0.5);

  console.log(totalAmount);
  return {
    totalAmount,
    companyProfit,
    managerProfit,
    amountPurchase,
  };
};

export default function useDataFormHook(defaultDeal?: DealDto) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState<string | undefined>(
    defaultDeal?.serviceId || undefined
  );
  const [companyId, setCompanyId] = useState<string | undefined>(
    defaultDeal?.customerId || undefined
  );
  const [stageId, setStageId] = useState<string | undefined>(
    defaultDeal?.stageId || undefined
  );
  const [materialId, setMaterialId] = useState<string | undefined>(
    defaultDeal?.materialId || undefined
  );

  const [measurementUnit, setMeasurementUnit] = useState<MeasurementUnit>(
    (defaultDeal?.unitMeasurement as MeasurementUnit) || "тонна"
  );
  const [quantity, setQuantity] = useState<number>(defaultDeal?.quantity || 0);
  const [amountPerUnit, setAmountPerUnit] = useState<string>(
    defaultDeal?.amountPerUnit ? String(defaultDeal.amountPerUnit) : "0"
  );
  const [amountSale, setAmountSale] = useState<string>(
    defaultDeal?.amountSale ? String(defaultDeal.amountSale) : "0"
  );
  const [amountDelivery, setAmountDelivery] = useState<string>(
    defaultDeal?.amountDelivery ? String(defaultDeal.amountDelivery) : "0"
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    (defaultDeal?.paymentMethod as PaymentMethod) || "наличный расчет"
  );
  const [receivingMethod, setReceivingMethod] = useState<ReceivingMethod>(
    (defaultDeal?.methodReceiving as ReceivingMethod) || "самовывоз"
  );
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    defaultDeal?.deliveryAddress || ""
  );
  const [shippingAddress, setShippingAddress] = useState<string>(
    defaultDeal?.shippingAddress || ""
  );
  const [deliveryOssig, setDeliveryOssig] = useState<boolean>(
    defaultDeal?.OSSIG || false
  );

  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(
    defaultDeal?.deadline
      ? new Date(defaultDeal.deadline.split("T")[0])
      : undefined
  );
  const [deliveryTime, setDeliveryTime] = useState<string>(
    defaultDeal?.deadline ? defaultDeal.deadline.split("T")[1] : ""
  );

  const [notes, setNotes] = useState<string>(defaultDeal?.notes || "");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Calculate totals with debounce
  const debounced = useDebounce(
    useMemo(
      () => [quantity, amountPerUnit, amountSale, amountDelivery],
      [quantity, amountPerUnit, amountSale, amountDelivery]
    ),
    300
  );
  const total = useMemo(
    () =>
      calculateTotal(
        Number(debounced[0]),
        Number(debounced[1]),
        Number(debounced[2]),
        Number(debounced[3])
      ),
    [debounced]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const dataToSend: CreateDealRequest = {
        serviceId: serviceId!,
        customerId: companyId!,
        stageId: stageId!,
        materialId: materialId!,
        unitMeasurement: measurementUnit,
        quantity: quantity,
        methodReceiving: receivingMethod,
        paymentMethod: paymentMethod,

        amountPerUnit: Number(amountPerUnit),
        amountPurchase: total.amountPurchase,
        amountSale: Number(amountSale),
        amountDelivery: Number(amountDelivery),
        shippingAddress: shippingAddress,
        deliveryAddress: deliveryAddress,
        companyProfit: total.companyProfit,
        totalAmount: total.totalAmount,
        managerProfit: total.managerProfit,
        deadline: `${deliveryDate?.getFullYear()}-${(
          (deliveryDate?.getMonth() || 0) + 1
        )
          .toString()
          .padStart(2, "0")}-${deliveryDate
          ?.getDate()
          .toString()
          .padStart(2, "0")}T${deliveryTime}`, // TODO: add deadline input
        notes: notes,
        OSSIG: deliveryOssig,
      };

      const response = await dealsService.createDeal(dataToSend);
      router.push("/deals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (defaultDeal && defaultDeal.serviceId === serviceId) {
      setStageId(defaultDeal.stageId || undefined);
      setMaterialId(defaultDeal.materialId || undefined);
      setMeasurementUnit(
        (defaultDeal.unitMeasurement as MeasurementUnit) || "тонна"
      );
      setQuantity(defaultDeal.quantity || 0);
      setAmountPerUnit(String(defaultDeal.amountPerUnit || "0"));
      setAmountSale(String(defaultDeal.amountSale || "0"));
      setAmountDelivery(String(defaultDeal.amountDelivery || "0"));
      setShippingAddress(defaultDeal.shippingAddress || "");
      setDeliveryAddress(defaultDeal.deliveryAddress || "");
      setDeliveryOssig(defaultDeal.OSSIG || false);
      setPaymentMethod(
        (defaultDeal.paymentMethod as PaymentMethod) || "наличный расчет"
      );
      setReceivingMethod(
        (defaultDeal.methodReceiving as ReceivingMethod) || "самовывоз"
      );
      setNotes(defaultDeal.notes || "");
      return;
    }
    setStageId(undefined);
    setMaterialId(undefined);
    setMeasurementUnit("тонна");
    setQuantity(0);
    setAmountPerUnit("0");
    setAmountSale("0");
    setAmountDelivery("0");
    setShippingAddress("");
    setDeliveryAddress("");
    setDeliveryOssig(false);
    setPaymentMethod("наличный расчет");
    setReceivingMethod("самовывоз");
    setNotes("");
  }, [serviceId, defaultDeal]);

  useEffect(() => {
    if (defaultDeal && defaultDeal.methodReceiving === receivingMethod) {
      setDeliveryAddress(defaultDeal.deliveryAddress || "");
      setAmountDelivery(String(defaultDeal.amountDelivery || "0"));
      return;
    }
    setDeliveryAddress("");
    setAmountDelivery("0");
  }, [receivingMethod, defaultDeal]);

  return {
    serviceId,
    setServiceId,
    companyId,
    setCompanyId,
    stageId,
    setStageId,
    materialId,
    setMaterialId,
    measurementUnit,
    setMeasurementUnit,
    quantity,
    setQuantity,
    amountPerUnit,
    setAmountPerUnit,
    amountSale,
    setAmountSale,
    amountDelivery,
    setAmountDelivery,
    paymentMethod,
    setPaymentMethod,
    receivingMethod,
    setReceivingMethod,
    shippingAddress,
    setShippingAddress,
    deliveryAddress,
    setDeliveryAddress,
    deliveryOssig,
    setDeliveryOssig,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    notes,
    setNotes,
    total,
    error,
    submitting,
    handleSubmit,
  };
}
