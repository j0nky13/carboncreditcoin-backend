export const getProducts = async (req, res) => {
  res.status(200).json([
    {
      id: 1,
      name: 'Carbon Credit Coin Hoodie',
      price: 45,
      image: '/images/hoodie.png',
    },
    {
      id: 2,
      name: 'CO2TAX Dad Hat',
      price: 25,
      image: '/images/hat.png',
    }
  ]);
};