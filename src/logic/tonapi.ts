import axios from 'axios'

interface Attribute {
    trait_type: undefined | string,
    value: undefined | string
}

interface Collection {
    address: string,
    metadata: undefined | {
        cover_image: string | undefined,
        description: string | undefined,
        external_link: any | undefined,
        external_url: string | undefined,
        image: string | undefined,
        marketplace: string | undefined,
        name: string | undefined,
        social_links: string[] | undefined
    },
    next_item_index: number,
    owner: undefined | {
        address: string,
        icon: string,
        is_scam: boolean,
        name: string
    },
    raw_collection_content: string
}

interface Item {
    address: string,
    approved_by: any,
    collection: undefined | {
        address: string,
        name: string
    },
    collection_address: string | any,
    index: number,
    verified: boolean,
    metadata: {
        name: string | undefined,
        marketplace: string | undefined,
        image: string | undefined,
        description: string | undefined,
        attributes: undefined | Attribute[]
    },
    previews: {
        url: string
    }[] | undefined,
    owner: undefined | {
        address: string,
        is_scam: boolean
    },
    sale: undefined | {
        address: string,
        market: undefined | {
            address: string,
            icon: string,
            is_scam: boolean,
            name: string
        },
        owner: undefined | {
            address: string,
            icon: string,
            is_scam: boolean,
            name: string
        },
        price: {
            token_name: string,
            value: string
        }
    }
}

interface Items {
    nft_items: Item[]
}

interface Collections {
    nft_collections: Collection[]
}

interface Account {
    address: {
        bounceable: string,
        non_bounceable: string,
        raw: string
    },
    balance: number,
    icon: undefined | string,
    interfaces: any[],
    is_scam: boolean,
    last_update: number,
    memo_required: boolean,
    name: undefined | string,
    status: string
}

export class TonApi {
    private _url: string = 'https://tonapi.io/v1/'

    // private _token: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMjI0Iiwic2NvcGUiOiJjbGllbnQifQ.vvtwTq9kO89CNP2635wImtrzshdrAM9AYaIbQNqfJHQ'

    private _token: string = 'AFXRKLZM2YCJ67AAAAAE4XDRSACSYEOYKQKOSUVUKMXNMP2AKUTWJ2UVBPTTQZWRGZMLALY'

    public async send (url: string, data: any): Promise<any | undefined> {
        const res = await axios.get(`${this._url}${url}?${new URLSearchParams(data)}`, { headers: { Authorization: `Bearer ${this._token}` } })

        if (res.data.error) {
            console.error(res.data.result)
            return undefined
        }
        return res.data
    }

    public async getItems (address: string): Promise<Items | undefined> {
        const data = await this.send('nft/getItems', { addresses: address })

        console.log(data)
        return data
    }

    public async getCollection (address: string): Promise<Collection | undefined> {
        const data = await this.send('nft/getCollection', { account: address })

        console.log(data)
        return data
    }

    public async getCollections (limit:number = 100, offset: number = 0): Promise<Collections | undefined> {
        const data = await this.send('nft/getCollections', { limit, offset })

        console.log(data)
        return data
    }

    public async searchItems (address: string, limit:number = 100, offset: number = 0): Promise<Items | undefined> {
        const data = await this.send('nft/searchItems', { collection: address, limit, offset })

        console.log(data)
        return data
    }

    public async searchItemsFromUser (address: string, limit:number = 100, offset: number = 0): Promise<Items | undefined> {
        const data = await this.send('nft/searchItems', { owner: address, limit, offset, include_on_sale: true })

        console.log(data)
        return data
    }

    public async searchItemsfull (limit:number = 100, offset: number = 0): Promise<Items | undefined> {
        const data = await this.send('nft/searchItems', { limit, offset })

        console.log(data)
        return data
    }

    public async getInfoUser (address: string): Promise<Account | undefined> {
        const data = await this.send('account/getInfo', { account: address })

        console.log(data)
        return data
    }
}

export type { Items, Item, Collection, Collections, Account }
