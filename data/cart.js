export const cart=[];

export function addToCart(productId){
  let matchingItems;
  cart.forEach((item)=>{
    if(productId===item.productId){
      matchingItems=item;
    }
  })
  if(matchingItems){
    matchingItems.quantity+=1;
  }
  else{
    cart.push({
      productId:productId,
      quantity:1
    });
  }
}