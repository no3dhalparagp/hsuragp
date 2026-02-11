"use client"

import React from "react"
import { E164Number } from "libphonenumber-js/core"
import Image from "next/image"
import ReactDatePicker from "react-datepicker"
import { Control } from "react-hook-form"
import PhoneInput from "react-phone-number-input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import "react-datepicker/dist/react-datepicker.css";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  NUMBER = "number",
  OTP = "otp",
  RADIO = "radio",
}

interface CustomProps {
  control: Control<any>
  name: string
  label?: string
  placeholder?: string
  icon?: React.ReactNode
  iconSrc?: string
  iconAlt?: string
  tooltip?: string
  disabled?: boolean
  dateFormat?: string
  showTimeSelect?: boolean
  children?: React.ReactNode
  renderSkeleton?: (field: any) => React.ReactNode
  fieldType: FormFieldType
  otpLength?: number
  options?: { label: string; value: string }[]
  containerClass?: string
  labelClass?: string
  inputClass?: string
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  checkboxClass?: string
  datePickerWrapperClass?: string
  appendButton?: React.ReactNode
}

const formatLabel = (label: string): string => {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim()
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="relative group">
          {(props.icon || props.iconSrc) && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              {props.icon || (
                <Image
                  src={props.iconSrc!}
                  height={20}
                  width={20}
                  alt={props.iconAlt || "icon"}
                  className="text-gray-400 group-focus-within:text-primary transition-colors"
                />
              )}
            </div>
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              {...props.inputProps}
              className={`pl-10 pr-4 h-11 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${
                props.inputClass
              } ${props.icon || props.iconSrc ? 'pl-10' : ''}`}
            />
          </FormControl>
          {props.appendButton && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {props.appendButton}
            </div>
          )}
        </div>
      )

    case FormFieldType.NUMBER:
      return (
        <FormControl>
          <Input
            type="number"
            placeholder={props.placeholder}
            {...field}
            className={`h-11 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${
              props.inputClass
            }`}
            disabled={props.disabled}
          />
        </FormControl>
      )

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className={`rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 min-h-[100px] ${
              props.inputClass
            }`}
            disabled={props.disabled}
          />
        </FormControl>
      )

    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <div className="relative">
            <PhoneInput
              defaultCountry="US"
              placeholder={props.placeholder}
              international
              withCountryCallingCode
              value={field.value as E164Number | undefined}
              onChange={field.onChange}
              className={`phone-input h-11 rounded-lg border border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 ${props.inputClass}`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Image
                src="/icons/phone.svg"
                width={20}
                height={20}
                alt="Phone"
                className="text-gray-400"
              />
            </div>
          </div>
        </FormControl>
      )

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className={`flex items-center gap-3 ${props.checkboxClass}`}>
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              className="h-5 w-5 rounded-md border-2 border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary transition-colors focus:ring-2 focus:ring-primary/20"
            />
            <label 
              htmlFor={props.name} 
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              {props.label}
            </label>
          </div>
        </FormControl>
      )

    case FormFieldType.DATE_PICKER:
      return (
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <Image
              src="/icons/calendar.svg"
              height={20}
              width={20}
              alt="calendar"
              className="text-gray-400 group-focus-within:text-primary transition-colors"
            />
          </div>
          <FormControl>
            <ReactDatePicker
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value}
              onChange={(date: Date | null) => date && field.onChange(date)}
              timeInputLabel="Time:"
              dateFormat={props.dateFormat ?? "MM/dd/yyyy - h:mm aa"}
              wrapperClassName="w-full"
              className={`w-full pl-10 pr-4 h-11 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${props.inputClass}`}
            />
          </FormControl>
        </div>
      )

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger
                className={`h-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 transition-all duration-200 ${props.inputClass}`}
              >
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="rounded-lg border border-gray-200 shadow-lg py-2 mt-1 bg-white z-[1000]">
              {props.options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-gray-50 focus:bg-gray-50 px-4 py-2 transition-colors duration-150"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      )

    case FormFieldType.OTP:
      return (
        <FormControl>
          <InputOTP
            maxLength={props.otpLength || 6}
            render={({ slots }) => (
              <InputOTPGroup className="gap-3">
                {slots.map((slot, index) => (
                  <React.Fragment key={index}>
                    <InputOTPSlot
                      className="w-12 h-12 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      {...slot}
                      index={index}
                    />
                    {index !== slots.length - 1 && <InputOTPSeparator />}
                  </React.Fragment>
                ))}
              </InputOTPGroup>
            )}
            {...field}
          />
        </FormControl>
      )

    case FormFieldType.RADIO:
      return (
        <FormControl>
          <div className="space-y-3">
            {props.options?.map((option) => (
              <div key={option.value} className="relative flex items-center">
                <input
                  type="radio"
                  id={`${props.name}-${option.value}`}
                  {...field}
                  value={option.value}
                  checked={field.value === option.value}
                  className="sr-only peer"
                />
                <label
                  htmlFor={`${props.name}-${option.value}`}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 group-hover:border-primary flex items-center justify-center transition-colors peer-focus:ring-2 peer-focus:ring-primary/20">
                    {field.value === option.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {option.label}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </FormControl>
      )

    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null

    default:
      return null
  }
}

const CustomFormField = (props: CustomProps) => {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={`space-y-3 ${props.containerClass}`}>
          {props.fieldType !== FormFieldType.CHECKBOX && (
            <FormLabel className={`flex items-center text-sm font-medium text-gray-700 mb-1 ${props.labelClass}`}>
              {props.label || formatLabel(props.name)}
              {props.tooltip && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        type="button" 
                        className="ml-2 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full"
                      >
                        <Image
                          src="/icons/info.svg"
                          width={16}
                          height={16}
                          alt="Info"
                          className="inline-block opacity-70 hover:opacity-100 transition-opacity"
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-gray-800 text-white border-0 px-3 py-2 rounded-lg shadow-lg">
                      <p className="text-sm">{props.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </FormLabel>
          )}
          <div className="relative">
            <RenderInput field={field} props={props} />
          </div>
          <FormMessage className="text-red-600 text-sm mt-1 font-medium" />
        </FormItem>
      )}
    />
  )
}

export default CustomFormField
