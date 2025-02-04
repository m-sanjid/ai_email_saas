import { Textarea } from "@/components/ui/textarea";
import React from "react";

function TextAreaField({ label, value, onHandleInputChange }) {
  return (
    <div>
      <label>{label}</label>
      <Textarea />
    </div>
  );
}

export default TextAreaField;
