/**
 * The component renders each balance individually in the rows array, resulting in multiple re-renders for every balance. 
 * This can lead to performance issues, especially with a large number of balances. The rendering is optimized by memoizing the filtered, 
 * sorted, and formatted balances arrays using useMemo.
 * 
 * The sortedBalances array is sorted twice - once to filter out balances with negative amounts and again to sort the remaining balances. 
 * This is redundant and inefficient. Sorting is now only performed once on filtered balances array.
 * 
 * There's no proper error handling for the promise returned by getPrices(). It should be caught and logged appropriately.
 * 
 * Combined cases with the same priority in getPriority function to reduce redundancy.
 */

interface WalletBalance {
    currency: string;
    amount: number;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}


// Datasource class implementation
class Datasource {
    url: string;
  
    constructor(url: string) {
      this.url = url;
    }
  
    async getPrices(): Promise<any> {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      return await response.json();
    }
}


interface Props extends BoxProps {

}
  // Refactored WalletPage component
  const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const [prices, setPrices] = useState({});
  
    useEffect(() => {
      const fetchPrices = async () => {
        try {
          const datasource = new Datasource("https://interview.switcheo.com/prices.json");
          const fetchedPrices = await datasource.getPrices();
          setPrices(fetchedPrices);
        } catch (error) {
          console.error(error);
        }
      };
      fetchPrices();
    }, []);
  
    const getPriority = (blockchain: string): number => {
      switch (blockchain) {
        case 'Osmosis':
          return 100;
        case 'Ethereum':
          return 50;
        case 'Arbitrum':
          return 30;
        case 'Zilliqa':
        case 'Neo': // Combine Zilliqa and Neo cases with the same priority
          return 20;
        default:
          return -99;
      }
    };
  
    const filteredBalances = useMemo(() => {
      return balances.filter(balance => balance.amount > 0); // Filter out balances with negative amounts
    }, [balances]);
  
    const sortedBalances = useMemo(() => {
      return filteredBalances.sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain));
    }, [filteredBalances]);
  
    const formattedBalances = useMemo(() => {
      return sortedBalances.map(balance => ({
        ...balance,
        formatted: balance.amount.toFixed()
      }));
    }, [sortedBalances]);
  
    const rows = useMemo(() => {
      return formattedBalances.map((balance, index) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow 
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      });
    }, [formattedBalances, prices]);
  
    return (
      <div {...rest}>
        {rows}
      </div>
    );
  };
  