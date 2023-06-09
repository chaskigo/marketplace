import {
  Component,
  OnInit,
} from '@angular/core';

import { Path } from '../../../config';
import {
  DinamicRating,
  Rating,
} from '../../../functions';
import { CategoriesService } from '../../../services/categories.service';
import { ProductsService } from '../../../services/products.service';
import { SubCategoriesService } from '../../../services/sub-categories.service';

declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-home-showcase',
  templateUrl: './home-showcase.component.html',
  styleUrls: ['./home-showcase.component.css']
})
export class HomeShowcaseComponent implements OnInit {
	path:string = Path.url;
	categories:any[] = [];
	preload:boolean = false;
	render:boolean = true;
	getCategories:any[] = [];
  countProduct=0
  preloadSV=0
  rating:any[] = [];
    constructor(private categoriesService: CategoriesService, private subCategoriesService: SubCategoriesService, private productsService: ProductsService) { }
	ngOnInit(): void {
		this.preload = true;
		/*=============================================
		Tomamos la data de las categorias
		=============================================*/
		this.categoriesService.getFilterData("state","show")
		.subscribe( resp => {
			let i;
			for(i in resp){
				this.getCategories.push(resp[i])
			}
			/*=============================================
			Ordenamos de mayor vistas a menor vistas el arreglo de objetos
			=============================================*/
			this.getCategories.sort(function(a,b){
				return(b.view - a.view)
			})
			/*=============================================
			Filtramos hasta 6 categorías
			=============================================*/
			this.getCategories.forEach((category, index)=>{
				if(index < 6){
					this.categories[index] = this.getCategories[index];
					this.preload = false;
				}
			})
		})
	}
	/*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/
	callback(indexes:any){

		if(this.render){
			this.render = false;
			let arraySubCategories:any = [];
			let arrayProducts:any = [];
      this.productsService.getData().subscribe((resp:any)=>{
        this.preloadSV = Object.keys(resp).length
        this.preloadSV = ((indexes+1)*6)-this.preloadSV
      })


			/*=============================================
			Separar las categorías
			=============================================*/
			this.categories.forEach((category, index)=>{
				/*=============================================
				Tomamos la colección de las sub-categorías filtrando con los nombres de categoría
				=============================================*/
				this.subCategoriesService.getFilterData("category", category.name)
				.subscribe((resp:any)=>{
					let i;
					for(i in resp){
						arraySubCategories.push({
							"category": resp[i].category,
							"subcategory": resp[i].name,
							"url": resp[i].url
						})
					}
					/*=============================================
					Recorremos el array de objetos nuevo para buscar coincidencias con los nombres de categorías
					=============================================*/
					for(i in arraySubCategories){
						if(category.name == arraySubCategories[i].category){
							$(`[category-showcase='${category.name}']`).append(`
								<li><a href="products/${arraySubCategories[i].url}">${arraySubCategories[i].subcategory}</a></li>
							`)
						}
					}
				})
				/*=============================================
				Tomamos la colección de los productos filtrando con las url's de categorías
				=============================================*/
				this.productsService.getFilterDataWithLimit("category", category.url, 6)
				.subscribe(resp=>{
					let i;
          this.countProduct = Object.keys(resp).length
          if(this.countProduct > 0){
            for(i in resp){
              arrayProducts.push({
                "category": resp[i].category,
                "url": resp[i].url,
                "name": resp[i].name,
                "image": resp[i].image,
                "price": resp[i].price,
                "offer": resp[i].offer,
                "reviews": resp[i].reviews,
                "stock": resp[i].stock,
                "vertical_slider": resp[i].vertical_slider
              })
            }}

					/*=============================================
					Recorremos el array de objetos nuevo para buscar coincidencias con las url de categorías
					=============================================*/
					for(i in arrayProducts){
						if(category.url ==  arrayProducts[i].category){
							/*=============================================
							Definimos si el precio del producto tiene oferta o no
							=============================================*/
							let price;
							let type;
							let value;
							let offer;
							let offerDate;
							let disccount=""
        			let today = new Date();
							if(arrayProducts[i].offer != ""){
								offerDate = new Date(
									parseInt(JSON.parse(arrayProducts[i].offer)[2].split("-")[0]),
									parseInt(JSON.parse(arrayProducts[i].offer)[2].split("-")[1]) - 1,
									parseInt(JSON.parse(arrayProducts[i].offer)[2] .split("-")[2])

								)
								if (today < offerDate) {
								type = JSON.parse(arrayProducts[i].offer)[0];
								value = JSON.parse(arrayProducts[i].offer)[1];
								if(type == "Disccount"){
									offer = (arrayProducts[i].price - (arrayProducts[i].price * value/100)).toFixed(2)
								}
								if(type == "Fixed"){
                  console.log(value)
									offer = value;
									value = 100 - Math.round(offer*100/arrayProducts[i].price);
								}
								disccount = `<div class="ps-product__badge">-${value}%</div>`;
								price = `<p class="ps-product__price sale">$${offer} <del>$${arrayProducts[i].price} </del></p>`
								}else{
									price = `<p class="ps-product__price">$${arrayProducts[i].price} </p>`
								}
							}else{
								price = `<p class="ps-product__price">$${arrayProducts[i].price} </p>`
							}
							/*=============================================
							Calculamos el total de las calificaciones de las reseñas
							=============================================*/
							let totalReview = 0;
							for(let f = 0; f < JSON.parse(arrayProducts[i].reviews).length; f++){
								totalReview += Number(JSON.parse(arrayProducts[i].reviews)[f]["review"])
							}
							/*=============================================
							Imprimimos el total de las calficiaciones para cada producto
							=============================================*/
              this.rating.push(DinamicRating.fnc(arrayProducts[i]))
							/*=============================================
							Definimos si el producto tiene stock
							=============================================*/
							if(arrayProducts[i].stock == 0){
								disccount = `<div class="ps-product__badge out-stock">Sin Stock</div>`;
							}
							/*=============================================
							Imprimimos los productos en el HTML
							=============================================*/
							$(`[category-pb='${arrayProducts[i].category}']`).append(`
								  <div class="ps-product ps-product--simple">
				                    <div class="ps-product__thumbnail">
				                    	<a href="product/${arrayProducts[i].url}" aria-label="Productos">
				                    		<img loading="lazy" src="assets/img/categories/${arrayProducts[i].category}/${arrayProducts[i].image}" alt="">
				                    	</a>
				                        ${disccount}
				                    </div>
				                    <div class="ps-product__container">
				                        <div class="ps-product__content" data-mh="clothing">
				                        	<a class="ps-product__title" href="product/${arrayProducts[i].url}" aria-label="Productos">${arrayProducts[i].name}</a>
				                            <div class="ps-product__rating">
				                                <select class="ps-rating productRating" data-read-only="true">
				                                </select>
				                                <span>${this.rating[i]}</span>
				                            </div>
				                            ${price}
				                        </div>
				                    </div>
				                </div>
			                `)
			                /*=============================================
							Clasificamos la cantidad de estrellas según la calificación
							=============================================*/
							let arrayRating = $(".productRating");
							for(let i = 0; i < arrayRating.length; i++){
								for(let f = 1; f <= 5; f++){
                  if(this.rating[i]>0){
				  					       $(arrayRating[i]).append(`<option value="2">${f}</option>`)
				                      if(this.rating[i] == f){
				                        $(arrayRating[i]).children('option').val(1)
				                      }
                            }
                            else{
                              if(f<=1){
                              $(arrayRating[i]).append(`<option value="0">${f}</option>`)
                              $(arrayRating[i]).append(`<option value="1">${f+1}</option>`)
                              }
                              else{
                                $(arrayRating[i]).append(`<option value="1">${f}</option>`)
                              }
                            }
  							}
              }

							/*=============================================
							Ejecutar funciones globales con respecto a las Reseñas
							=============================================*/
							Rating.fnc();
							/*=============================================
							Imprimimos los productos en el Vertical Slider
							=============================================*/
							$(`[category-sl='${arrayProducts[i].category}']`).append(`
								<a href="product/${arrayProducts[i].url}" aria-label="Productos">
			                		<img loading="lazy" src="assets/img/categories/${arrayProducts[i].category}/vertical/${arrayProducts[i].vertical_slider}" alt="">
			                	</a>
							`)
							/*=============================================
							Ejecutar funciones globales con respecto al carrusel
							=============================================*/
							this.preloadSV++;
							if(this.preloadSV == (indexes+1)*6){
								$(`[category-sl]`).addClass('ps-carousel--product-box')
								$(`[category-sl]`).addClass('owl-slider')
								$(`[category-sl]`).owlCarousel({
									 items: 1,
									 autoplay: true,
									 autoplayTimeout: 7000,
									 loop: true,
                              nav: true,
                              margin: 0,
                              dots: true,
                              navSpeed: 500,
                              dotsSpeed: 500,
                              dragEndSpeed: 500,
                              navText: ["<i class='icon-chevron-left'></i>", "<i class='icon-chevron-right'></i>"],
								});
							}
						}
					}
				})
			})
		}
	}
}
