"use client";

import { useDebounce } from "@/lib/debouncer";
import { dealsService } from "@/services";
import CreateDealRequest from "@definitions/requests/create-deal";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

const roundWithDecimals = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;

const calculateTotal = (
  quantity: number,
  pricePerUnit: number,
  deliveryPrice: number = 0
) => {
  var purchase = quantity * pricePerUnit;
  var sumWithoutProfit = purchase + deliveryPrice;
  var companyProfit = roundWithDecimals(sumWithoutProfit * 0.2);
  var total = sumWithoutProfit + companyProfit;
  var managerProfit = roundWithDecimals(companyProfit * 0.5);
  return {
    total,
    companyProfit,
    managerProfit,
    purchase,
  };
};

export default function useDataFormHook() {
  const router = useRouter();
  const [serviceId, setServiceId] = useState<string | undefined>(undefined);
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const [stageId, setStageId] = useState<string | undefined>(undefined);
  const [materialId, setMaterialId] = useState<string | undefined>(undefined);

  const [measurementUnit, setMeasurementUnit] = useState<
    "тонна" | "куб.м" | "шт"
  >("тонна");
  const [quantity, setQuantity] = useState<number>(0);
  const [amountPerUnit, setAmountPerUnit] = useState<number>(0);

  const [paymentMethod, setPaymentMethod] = useState<
    "наличный расчет" | "безналичный расчет"
  >("наличный расчет");
  const [receivingMethod, setReceivingMethod] = useState<
    "самовывоз" | "доставка"
  >("самовывоз");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [deliveryOssig, setDeliveryOssig] = useState<boolean>(false);

  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [deliveryTime, setDeliveryTime] = useState<string>("");

  const [notes, setNotes] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const debounced = useDebounce([quantity, amountPerUnit], 300);
  const total = useMemo(
    () => calculateTotal(debounced[0], debounced[1], 0),
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

        amountPerUnit: amountPerUnit,
        amountPurchase: total.purchase,
        amountDelivery: 0, // TODO: add delivery price input
        companyProfit: total.companyProfit,
        totalAmount: total.total,
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
    setStageId(undefined);
    setMaterialId(undefined);
    setMeasurementUnit("тонна");
    setQuantity(0);
    setAmountPerUnit(0);
    setPaymentMethod("наличный расчет");
    setReceivingMethod("самовывоз");
    setDeliveryAddress("");
    setDeliveryOssig(false);
    setNotes("");
  }, [serviceId]);

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
    paymentMethod,
    setPaymentMethod,
    receivingMethod,
    setReceivingMethod,
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
