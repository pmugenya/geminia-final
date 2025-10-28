export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
}
export interface CreateUserObject {
    firstName: string,
    password: string,
    passwordConfirm: string,
    clientType: string,
    docnumber: string,
    pinNumber: string,
    mobileno: string,
    email: string,
}


export interface QuotesData {
    refno: string;
    catId: number;
    category: string;
    prodId: number;
    prodName: string;
    cargotypeId: number;
    cargotype: string;
    originId: string;
    firstName: string;
    lastName: string;
    email: string;
    vesselName: string;
    idfNumber: string;
    destination: string;
    countyName: string;
    originCountry: string;
    shippingmodeId: number;
    shippingmode: string;
    countyId: number;
    originPortId: number;
    dischargePortId: number;
    packagingtypeId: number;
    packagingtype: string;
    sumassured: number;
    premium: number;
    traininglevy: number;
    phcf: number;
    sd: number;
    netprem: number;
    createDate: string;       // ISO date string (e.g. '2025-10-12')
    dateArrival: string;      // same as LocalDate
    dateDispatch: string;
    invoiceIdExists: boolean;
    idfDocumentExists: boolean;
    kraDocumentExists: boolean;
    idDocumentExists: boolean;
    description: string;
    status: string;
    quoteId: number;
    prospectId: number;
    pinNumber: string;
    idNumber: string;
    phoneNo: string;
    postalCode: string;
    postalAddress: string;
}


export interface QuoteResult {
    result: number,
    premium: number,
    phcf: number,
    tl: number,
    sd: number,
    netprem: number,
}

export interface MarineProduct {
    id: number
    prodshtdesc: string;
    prodname: string;
    productid: number;
    productdisplay: number;
}

export interface Country {
    id: number;
    countryname:string;
}

export interface County {
    id: number;
    portName:string;
}

export interface Port {
    id: number;
    portName:string;
    portid:string;
    shtdesc:string;
}

export interface PackagingType {
    id: number;
    packingtype: string
}


export interface Category {
    id: number;
    catname: string
}

export interface CargoTypeData {
    id: number;
    ctname: string
}
