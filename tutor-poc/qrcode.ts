import * as qrcodeGenerator from 'qrcode-generator';

export const qrcode = (data: string): string => {
	const typenumber: TypeNumber = 2;
	const errorCorrectionLevel: ErrorCorrectionLevel = 'L';
	const qr = qrcodeGenerator(typenumber, errorCorrectionLevel);
	qr.addData(data);
	qr.make();
	return qr.createASCII();
};
