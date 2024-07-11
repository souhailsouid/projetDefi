'use client';
import React, { useState } from 'react';
import { Input } from "@/components/ui/input"

const TokenInput = () => {

    const [value, setValue] = useState("")
    const handleChange = (e) => {
        setValue(e.target.value)
    }
  return <Input type="number" placeholder="NB Token" value={value} onChange={handleChange}  className="w-[180px]"/>
}
export default TokenInput;