const utils = require('../utils');

const poolsFunction = async () => {
    const dataTvl = await utils.getData('https://api.llama.fi/protocol/midas-rwa');
    const dataApy = await utils.getData('https://api-prod.midas.app/api/data/kpi');

    const { mBasisAPY, mTbillAPY, mBtcAPY } = dataApy;

    const chains = {
        Ethereum: {
            mtbill: {
                address: "0xdd629e5241cbc5919847783e6c96b2de4754e438",
                // USDC, USDT, DAI
                underlying: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "0xdAC17F958D2ee523a2206206994597C13D831ec7", "0x6B175474E89094C44Da98b954EedeAC495271d0F"],
                apy: mTbillAPY,
                url: "https://midas.app/mtbill"
            },
            mbasis: {
                address: "0x2a8c22E3b10036f3AEF5875d04f8441d4188b656",
                // USDC, USDT, DAI
                underlying: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "0xdAC17F958D2ee523a2206206994597C13D831ec7", "0x6B175474E89094C44Da98b954EedeAC495271d0F"],
                apy: mBasisAPY,
                url: "https://midas.app/mbasis"
            },
            mBTC: {
                address: "0x007115416AB6c266329a03B09a8aa39aC2eF7d9d",
                // WBTC
                underlying: ["0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"],
                apy: mBtcAPY,
                url: "https://midas.app/mbtc"
            }
        },
        Base: {
            mtbill: {
                address: "0xDD629E5241CbC5919847783e6C96B2De4754e438",
                // USDC
                underlying: ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"],
                apy: mTbillAPY,
                url: "https://midas.app/mtbill"
            },
            mbasis: {
                address: "0x1C2757c1FeF1038428b5bEF062495ce94BBe92b2",
                // USDC
                underlying: ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"],
                apy: mBasisAPY,
                url: "https://midas.app/mbasis"
            }
        },
        Sapphire: {
            mtbill: {
                address: "0xDD629E5241CbC5919847783e6C96B2De4754e438",
                underlying: ["0x0000000000000000000000000000000000000000"],
                apy: mTbillAPY,
                url: "https://midas.app/mtbill"
            }
        }
    };

    const pools = [];

    for (const [chainName, tokens] of Object.entries(chains)) {
        for (const [tokenName, tokenData] of Object.entries(tokens)) {

            const symbol = tokenName.toUpperCase();
            const tokenInUsd = dataTvl.chainTvls?.[chainName]?.tokensInUsd;
            const tokenInUsdValue = tokenInUsd[tokenInUsd.length - 1].tokens[symbol] || 0;

            pools.push({
                pool: `${tokenData.address}-${chainName.toLowerCase()}`,
                chain: chainName,
                project: 'midas-rwa',
                symbol: utils.formatSymbol(tokenName),
                tvlUsd: Number(tokenInUsdValue),
                apyBase: tokenData.apy * 100 || 0,
                underlyingTokens: tokenData.underlying, // TODO VERIFY
                url: tokenData.url
            });
        }
    }

    return pools;
};

module.exports = {
    timetravel: false,
    apy: poolsFunction
};