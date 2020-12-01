import { PayPalButtonProps } from "react-paypal-button-v2/dist/index";

declare module "react-paypal-button-v2/dist/index" {
    interface PayPalButtonProps {
	onCancel: Function
    }
}
