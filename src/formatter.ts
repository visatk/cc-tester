import { detectNetwork } from "./network";

export function formatCardNumber(cardNumber: string): string {
	const sanitized = cardNumber.replace(/\D/g, "");
	const network = detectNetwork(sanitized);

	if (network === "amex") {
		const match = sanitized.match(/^(\d{0,4})(\d{0,6})(\d{0,5})$/);
		if (match) return [match[1], match[2], match[3]].filter(Boolean).join(" ");
	}

	if (network === "diners_club") {
		const match = sanitized.match(/^(\d{0,4})(\d{0,6})(\d{0,4})$/);
		if (match) return [match[1], match[2], match[3]].filter(Boolean).join(" ");
	}

	const match = sanitized.match(
		/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,3})$/,
	);
	if (match) {
		return [match[1], match[2], match[3], match[4], match[5]]
			.filter(Boolean)
			.join(" ");
	}

	return sanitized;
}
