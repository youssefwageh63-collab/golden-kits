const seed=[
{id:1,name:"طقم ريال مدريد الأساسي",category:"أندية",price:950,tag:"الأكثر طلباً",type:"shirt",desc:"طقم كرة قدم بتصميم أبيض كلاسيكي."},
{id:2,name:"طقم برشلونة الأساسي",category:"أندية",price:920,tag:"جديد",type:"shirt",desc:"ألوان البلوجرانا لعشاق برشلونة."},
{id:3,name:"طقم ليفربول",category:"أندية",price:900,tag:"مميز",type:"shirt",desc:"تصميم أحمر مستوحى من روح النادي."},
{id:4,name:"طقم منتخب مصر",category:"منتخبات",price:850,tag:"وطني",type:"shirt",desc:"شجع الفراعنة بكل فخر."},
{id:5,name:"طقم منتخب الأرجنتين",category:"منتخبات",price:900,tag:"مميز",type:"shirt",desc:"الأبيض والسماوي لعشاق التانجو."},
{id:6,name:"حذاء كرة قدم",category:"أحذية",price:1250,tag:"جديد",type:"shoe",desc:"حذاء مناسب للتمرين واللعب."},
{id:7,name:"كرة قدم",category:"إكسسوارات",price:480,tag:"اختيارنا",type:"ball",desc:"كرة للتدريب واللعب."},
{id:8,name:"شراب رياضي",category:"إكسسوارات",price:150,tag:"أساسي",type:"sock",desc:"شراب رياضي مريح."}
];
let products=JSON.parse(localStorage.getItem("gk_products")||"null")||seed;
let cart=JSON.parse(localStorage.getItem("gk_cart")||"[]"),activeCat="الكل";
const $=s=>document.querySelector(s), money=n=>`${Number(n).toLocaleString("ar-EG")} ج.م`;
function save(){localStorage.setItem("gk_cart",JSON.stringify(cart));localStorage.setItem("gk_products",JSON.stringify(products));}
function art(p){return p.type==="ball"?"<span class='ball'>⚽</span>":p.type==="shoe"?"<span class='ball'>👟</span>":p.type==="sock"?"<span class='ball'>🧦</span>":"<div class='mini-shirt'>GK</div>"}
function renderProducts(){let q=$("#searchInput").value.trim().toLowerCase();let list=products.filter(p=>(activeCat==="الكل"||p.category===activeCat)&&p.name.toLowerCase().includes(q));$("#products").innerHTML=list.map(p=>`<article class="product"><div class="product-art">${p.tag?`<span class="tag">${p.tag}</span>`:""}${art(p)}</div><div class="product-info"><small>${p.category}</small><h3>${p.name}</h3><div class="price">${money(p.price)}</div><div class="product-actions"><button onclick="addToCart(${p.id})">أضف للسلة</button><button onclick="showProduct(${p.id})">التفاصيل</button></div></div></article>`).join("")||"<p class='empty'>مفيش منتجات مطابقة للبحث.</p>";}
function renderCart(){$("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);$("#cartTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));$("#checkoutTotal").textContent=$("#cartTotal").textContent;$("#cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div><b>${x.name}</b><small>${money(x.price)} × ${x.qty}</small></div><div class="qty"><button onclick="changeQty(${x.id},-1)">−</button>${x.qty}<button onclick="changeQty(${x.id},1)">+</button></div></div>`).join(""):"<p class='empty'>السلة لسه فاضية. اختار منتجاتك الأول.</p>";}
window.addToCart=id=>{let p=products.find(x=>x.id===id),x=cart.find(x=>x.id===id);if(x)x.qty++;else cart.push({...p,qty:1});save();renderCart();openCart();};
window.changeQty=(id,d)=>{let x=cart.find(x=>x.id===id);if(x)x.qty+=d;cart=cart.filter(x=>x.qty>0);save();renderCart();};
window.showProduct=id=>{let p=products.find(x=>x.id===id);$("#productDetail").innerHTML=`<div class="detail-art">${art(p)}</div><p class="eyebrow">${p.category}</p><h2>${p.name}</h2><p>${p.desc||""}</p><h3 class="price">${money(p.price)}</h3><label>المقاس<select id="sizeChoice"><option>غير مطلوب</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select></label><button class="gold-btn full" onclick="addToCart(${p.id});document.querySelector('#productDialog').close()">أضف للسلة</button>`;$("#productDialog").showModal();};
function openCart(){$("#cartDrawer").classList.add("open");$("#overlay").classList.add("show");}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("show");}
$("#cartOpen").onclick=openCart;$("#overlay").onclick=closeCart;$("#cartDrawer [data-close]").onclick=closeCart;$("#checkoutOpen").onclick=()=>{if(!cart.length)return;closeCart();$("#checkoutDialog").showModal();};
document.querySelectorAll("[data-dialog-close]").forEach(b=>b.onclick=()=>b.closest("dialog").close());
$("#searchInput").addEventListener("input",renderProducts);$("#searchToggle").onclick=()=>{$("#searchBox").scrollIntoView({behavior:"smooth",block:"center"});$("#searchInput").focus();};
$("#filters").addEventListener("click",e=>{let b=e.target.closest("button[data-cat]");if(!b)return;activeCat=b.dataset.cat;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
$("#menuToggle").onclick=()=>document.querySelector("nav").style.display=document.querySelector("nav").style.display==="flex"?"none":"flex";
async function submitOrder(order){
 const cfg=window.GK_CONFIG||{};
 if(cfg.supabaseUrl&&cfg.supabaseAnonKey){
   const res=await fetch(cfg.supabaseUrl.replace(/\/$/,"")+"/rest/v1/orders",{method:"POST",headers:{apikey:cfg.supabaseAnonKey,Authorization:"Bearer "+cfg.supabaseAnonKey,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify(order)});
   if(!res.ok)throw new Error("تعذر حفظ الطلب على قاعدة البيانات. راجع إعدادات الربط.");
 }else{
   let orders=JSON.parse(localStorage.getItem("gk_orders")||"[]");orders.unshift({...order,id:Date.now(),created_at:new Date().toISOString()});localStorage.setItem("gk_orders",JSON.stringify(orders));
 }
}
$("#checkoutForm").addEventListener("submit",async e=>{e.preventDefault();let f=new FormData(e.currentTarget),items=cart.map(({id,name,price,qty})=>({product_id:id,name,price,quantity:qty}));let order={customer_name:f.get("name"),phone:f.get("phone"),area:f.get("area"),address:f.get("address"),notes:f.get("notes"),items,total:cart.reduce((s,x)=>s+x.price*x.qty,0),payment_method:"الدفع عند الاستلام",status:"جديد"};let msg=$("#checkoutMessage");msg.textContent="جارٍ تسجيل الطلب...";try{await submitOrder(order);cart=[];save();renderCart();e.currentTarget.reset();msg.textContent="تم تسجيل طلبك بنجاح. سنتواصل معك لتأكيد التفاصيل."; }catch(err){msg.textContent=err.message;}});
renderProducts();renderCart();