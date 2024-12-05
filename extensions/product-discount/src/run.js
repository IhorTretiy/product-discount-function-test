// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Discount} Discount
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

const MIN_PRODUCT_QUANTITY = 2;
const MIN_DISCOUNT_PERCENTAGE = 10;
const MAX_DISCOUNT_PERCENTAGE = 20;

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const discounts = [];

  input.cart.lines.forEach((line) => {
    const quantity = line.quantity;
    const merchandise = line.merchandise;
    if (merchandise.__typename === "ProductVariant") {  
      const productVariantId = merchandise.product.id;
      if (quantity > MIN_PRODUCT_QUANTITY) {
        let discountPercentage = 0;
  
        if (quantity === 3) {
          discountPercentage = MIN_DISCOUNT_PERCENTAGE;
        } 
        else if (quantity > 3) {
          discountPercentage = MAX_DISCOUNT_PERCENTAGE;
        }
  
        if (discountPercentage > 0) {
          /** @type {Discount} */
          const discount = {
            value: {
              percentage: {
                value: 20,
              }
            },
            targets: [
              {
                productVariant: {
                  id: productVariantId,
                }
              }
            ],
            message: "20% off"
          };
          discounts.push(discount);
        }
      }
     }
  });

  console.log(discounts);

  if (discounts.length > 0) {
    return {
      discountApplicationStrategy: DiscountApplicationStrategy.First,
      discounts,
    };
  }

  return EMPTY_DISCOUNT;
}
