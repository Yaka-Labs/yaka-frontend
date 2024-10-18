import {getTHEAddress} from "../../../utils/addressHelpers";

export const DEFAULT_SWAP_TOKEN_ADDRESS = {
    1328:{
        'fromAddress':getTHEAddress(1328),//yaka
        'toAddress':'0x56BCa57a5493ffECF8A23574ae6856149Aa55A29'//SAI
    },
    1329:{
        'fromAddress':'0xB75D0B03c06A926e488e2659DF1A861F860bD3d1',//usdt
        'toAddress':'0xB75D0B03c06A926e488e2659DF1A861F860bD3d1'//usdt
    }
}
