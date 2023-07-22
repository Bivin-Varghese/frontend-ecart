import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(allProducts: any[], searchTearm: string, propertyName: string): any[] {
    const result: any = []


    if (!allProducts || searchTearm == '' || propertyName == '') {
      return allProducts
    }
    allProducts.forEach((item: any) => {
      if (item[propertyName].trim().toLowerCase().includes(searchTearm.trim().toLowerCase())) {
        result.push(item) 
      }
    })

    return result;
  }

}
