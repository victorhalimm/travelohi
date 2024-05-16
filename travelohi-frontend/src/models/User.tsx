export interface UserData {
    id : number,
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string,
    role : string,
    banned: boolean,
    newsletter: boolean,
    credit_card: CreditCard,
}

export interface CreditCard {
    ID : number,
    number : string,
    cvv : string,
    expiry_date : string
}