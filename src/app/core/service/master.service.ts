import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDashboardData()
  {
    return this.http.get(`${this.apiUrl}/admin/dashboard/dashboard`);
  }

  tourDestinationList(formData: any)
  {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post(`${this.apiUrl}/admin/tour-destination/list`, formData, {headers});
  }

  getAllDestinationList()
  {
    return this.http.get(`${this.apiUrl}/admin/tour-destination/list-all`);
  }

  getCountryList()
  {
    return this.http.get(`${this.apiUrl}/admin/countries/list-all`);
  }

  getStatesByCountry(countryId:any)
  {
    return this.http.get(`${this.apiUrl}/admin/countries/list-states/${countryId}`);
  }

  addDestination(formData: any)
  {
    const body = new FormData();
    body.append('name', formData.name);
    (formData.search_location)?body.append('search_location', formData.search_location):'';
    (formData.latitude)?body.append('latitude', formData.latitude):'';
    (formData.longitude)?body.append('longitude', formData.longitude):'';
    (formData.house_no)?body.append('house_no', formData.house_no):'';
    (formData.locality)?body.append('locality', formData.locality):'';
    (formData.pincode)?body.append('pincode', formData.pincode):'';
    (formData.state)?body.append('state', formData.state):'';
    (formData.city)?body.append('city', formData.city):'';
    (formData.country)?body.append('country', formData.country):'';
    (formData.country_id)?body.append('country_id', formData.country_id):'';
    (formData.state_id)?body.append('state_id', formData.state_id):'';
    (formData.meta_title)?body.append('meta_title', formData.meta_title):'';
    (formData.meta_keywords)?body.append('meta_keywords', formData.meta_keywords):'';
    (formData.meta_description)?body.append('meta_description', formData.meta_description):'';
    (formData.meta_tags)?body.append('meta_tags', formData.meta_tags):'';
    (formData.id)?body.append('id', formData.id):'';
    (formData.image_alt)?body.append('image_alt', formData.image_alt):'';
    (formData.image)?body.append('uploaded_file', formData.image):'';
    // body.append('is_suggested_destination', formData.is_suggested_destination);
    // body.append('is_international_destination', formData.is_suggested_destination);
    body.append('is_next_destination', formData.is_next_destination);
    body.append('is_popular_destination', formData.is_popular_destination);
    body.append('is_dream_destination', formData.is_dream_destination);
    body.append('is_explore_destination', formData.is_explore_destination);
    return this.http.post(`${this.apiUrl}/admin/tour-destination/manage`, body);
  }

  changeDestinationStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/tour-destination/change-status`,{id:item_id, is_active:status});
  }

  getRoomLists(formData: any)
  {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post(`${this.apiUrl}/admin/master-room/list`, formData, {headers});
  }

  getAllRooms()
  {
    return this.http.get(`${this.apiUrl}/admin/master-room/list-all`);
  }

  addMasterRoom(formData: any)
  {
    if(formData.id){
      return this.http.post(`${this.apiUrl}/admin/master-room/manage`, {id:formData.id, name:formData.name, description: formData.description});
    }else{
      return this.http.post(`${this.apiUrl}/admin/master-room/manage`, {name:formData.name, description: formData.description});
    }
    
  }

  changeRoomStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/master-room/change-status`,{id:item_id, is_active:status});
  }

  getTourCategoryList(formData:any)
  {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post(`${this.apiUrl}/admin/tour-category/list`, formData, {headers});
  }

  getTourCategoryAllList()
  {
    return this.http.get(`${this.apiUrl}/admin/tour-category/list-all`)
  }

  addTourCategory(formData: any)
  {
    const body = new FormData();
    body.append('name', formData.name);
    (formData.description)?body.append('description', formData.description):'';
    (formData.id)?body.append('id', formData.id):'';
    (formData.meta_title)?body.append('meta_title', formData.meta_title):'';
    (formData.meta_keywords)?body.append('meta_keywords', formData.meta_keywords):'';
    (formData.meta_description)?body.append('meta_description', formData.meta_description):'';
    (formData.meta_tags)?body.append('meta_tags', formData.meta_tags):'';
    (formData.image)?body.append('uploaded_file', formData.image):'';
    (formData.image_alt)?body.append('image_alt', formData.image_alt):'';
    return this.http.post(`${this.apiUrl}/admin/tour-category/manage`, body);
  }

  changeCategoryStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/tour-category/change-status`,{id:item_id, is_active:status});
  }

  getDurationList(formData:any)
  {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post(`${this.apiUrl}/admin/trip-duration/list`, formData, {headers});
  }

  getDurationByDestination(destinationId:any)
  {    
    return this.http.get(`${this.apiUrl}/admin/trip-duration/list-by-destination/${destinationId}`);
  }

  addTourDuration(formData: any)
  {
    const body = new FormData();
    body.append('destination_id', formData.destination_id);
    body.append('no_of_days', formData.no_of_days);
    (formData.image)?body.append('uploaded_file', formData.image):'';
    (formData.id)?body.append('id', formData.id):'';
    return this.http.post(`${this.apiUrl}/admin/trip-duration/manage`, body);
  }

  changeDurationStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/trip-duration/change-status`,{id:item_id, is_active:status});
  }

  masterRouteList(formData:any)
  {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post(`${this.apiUrl}/admin/master-route/list`, formData, {headers});
  }

  addMasterRoute(formData: any, files: File[])
  {
    const body = new FormData();
    body.append('route_name', formData.route_name);
    body.append('destination_id', formData.destination_id);
    (formData.search_location)?body.append('search_location', formData.search_location):'';
    (formData.latitude)?body.append('latitude', formData.latitude):'';
    (formData.longitude)?body.append('longitude', formData.longitude):'';
    (formData.house_no)?body.append('house_no', formData.house_no):'';
    (formData.locality)?body.append('locality', formData.locality):'';
    (formData.pincode)?body.append('pincode', formData.pincode):'';
    (formData.state)?body.append('state', formData.state):'';
    (formData.city)?body.append('city', formData.city):'';
    (formData.country)?body.append('country', formData.country):'';

    (formData.id)?body.append('id', formData.id):'';
    files.forEach((file, index) => {
      body.append('uploaded_files', file);
    });
    return this.http.post(`${this.apiUrl}/admin/master-route/manage`, body);
  }

  changeRouteStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/master-route/change-status`,{id:item_id, is_active:status});
  }

  deleteRouteImage(imageId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/master-route/delete-image/${imageId}`);
  }

  updateRouteImageAlt(formData:any) {
    return this.http.patch<any>(`${this.apiUrl}/admin/master-route/update-alt`, formData);
  }

  getRouteByDestination(destinationId: any)
  {
    return this.http.get(`${this.apiUrl}/admin/master-route/list-by-destination/${destinationId}`);

  }

  masterHotelList(formData:any)
  {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post(`${this.apiUrl}/admin/master-hotels/list`, formData, {headers});
  }

  addMasterHotel(formData: any, files: File[])
  {
    const body = new FormData();
    body.append('hotel_name', formData.hotel_name);
    body.append('route_id', formData.route_id);
    body.append('destination_id', formData.destination_id);
    body.append('room_id', formData.room_id);
    (formData.id)?body.append('id', formData.id):'';
    files.forEach((file, index) => {
      body.append('uploaded_files', file);
    });
    return this.http.post(`${this.apiUrl}/admin/master-hotels/manage`, body);
  }

  changeHotelStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/master-hotels/change-hotel-status`,{id:item_id, is_active:status});
  }

  deleteHotelImage(imageId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/master-hotels/delete-image/${imageId}`);
  }
  
  updateHotelImageAlt(formData:any) {
    return this.http.patch<any>(`${this.apiUrl}/admin/master-hotels/update-image-alt`, formData);
  }

  getTourPackages(formData:any)
  {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post(`${this.apiUrl}/admin/tour-package/list`, formData, {headers});
  }

  changeTourPackageStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/tour-package/change-status`,{id:item_id, is_active:status});
  }

  addTourBasicInfo(formData: any)
  {
    return this.http.post(`${this.apiUrl}/admin/tour-package/add-basic-info`, formData);
  }

  addTourPackageImage(packageId:string, files: File[])
  {
    let formData = new FormData();
    formData.append('tour_package_id', packageId);
    files.forEach((file, index) => {
      formData.append('uploaded_files', file);
    });
    return this.http.post(`${this.apiUrl}/admin/tour-package/add-tour-packages-images`, formData);
  }

  updateTourImageAlt(formData:any) {
    return this.http.patch<any>(`${this.apiUrl}/admin/tour-package/update-image-alt`, formData);
  }

  deleteTourPackageImage(imageId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package/delete-tour-package-image/${imageId}`);
  }

  deleteiInclusion(inclusionId:any)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package/delete-inclusion/${inclusionId}`);
  }

  deleteExclusion(exclusionId:any)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package/delete-exclusion/${exclusionId}`);
  }

  addTourDestination(formData: any)
  {
    const data = {
      ...(formData.id && { id: formData.id }),
      tour_package_id: formData.tour_package_id,
      route_id: formData.route_id,
      no_of_days_stay: formData.no_of_days_stay
    }

    return this.http.post(`${this.apiUrl}/admin/tour-package/add-trip-route`, data);
  }

  tourPackageInfo(package_id:any)
  {
    return this.http.get(`${this.apiUrl}/admin/tour-package/get-packages/${package_id}`);
  }

  addTourItinerary(formData: any)
  {
    return this.http.post(`${this.apiUrl}/admin/tour-package/add-tour-itinerary`, formData);
  }

  addTourTransfer(formData: any)
  {
    const data = {
      ...(formData.id && { id: formData.id }),
      tour_package_id: formData.tour_package_id,
      trip_route_id: formData.trip_route_id,
      tour_itinerary_id: formData.tour_itinerary_id,
      day_number: formData.day_number,
      transfer_type: formData.transfer_type,
      transfer_title: formData.transfer_title,
      details_json: {
        dropoff_location: formData.dropoff_location,
        halts: formData.halts.map((halt: any) => ({
          halt_location: halt.halt_location,
          halt_time: halt.halt_time
        })),
        pickup_location: formData.pickup_location,
        vehicle_type: formData.vehicle_type
      }
    }
    return this.http.post(`${this.apiUrl}/admin/tour-package/add-tour-transfer`, data);
  }

  deleteActivity(activityId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package/delete-activity/${activityId}`);
  }

  deleteStay(stayId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package/delete-stay/${stayId}`);
  }

  deleteTransfer(transferId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package/delete-transfer/${transferId}`);
  }

  deleteTourItinerary(itineraryId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package/delete-itinerary-details/${itineraryId}`);
  }

  addTourActivityData(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/tour-package/add-tour-activity`, formData);
  }

  addUpdateTourActivityExperience(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/tour-package/add-update-tour-activity-experience`, formData);
  }

  deleteTourActivityExperience(expId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package/delete-tour-activity-experience/${expId}`);
  }

  getRouteWiseHotels(routeId:any, roomId:string)
  {
    return this.http.get(`${this.apiUrl}/admin/master-hotels/list-by-route/${routeId}/${roomId}`);
  }

  addTourStay(formData:any)
  {
    const stayData = {
      ...(formData.id && { id: formData.id }),
      tour_package_id: formData.tour_package_id,
      trip_route_id: formData.trip_route_id,
      tour_itinerary_id: formData.tour_itinerary_id,
      room_id: formData.room_id,
      day_number: formData.day_number,
      stay_title: formData.stay_title,
      check_in_time: formData.check_in_time,
      check_out_time: formData.check_out_time,
      no_of_night_stay: formData.no_of_night_stay,
      is_breakfast: formData.is_breakfast,
      is_lunch: formData.is_lunch,
      is_dinner: formData.is_dinner,
      is_dinner_or_lunch: formData.is_dinner_or_lunch,
      hotels: formData.hotels.map((hotel: any) => ({
        hotel_id: hotel,
        rating: 0
      })),
    }
    return this.http.post(`${this.apiUrl}/admin/tour-package/add-tour-stay`, stayData);
  }

  updateItinerariesSort(formData:any)
  {
    return this.http.put(`${this.apiUrl}/admin/tour-package/update-itineraries-sort-order`, formData);
  }

  setPriceInfo(formData: any)
  {
    return this.http.post(`${this.apiUrl}/admin/tour-package/add-trip-room-price`, formData);
  }

  updateTripRoomPrice(formData: any)
  {
    return this.http.patch(`${this.apiUrl}/admin/tour-package/update-trip-room-price`, formData);
  }

  deleteTourPackage(packageId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package/delete/${packageId}`);
  }

  getBlogList(formData:any)
  {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post(`${this.apiUrl}/admin/blog/list`, formData, {headers});
  }

  getBlogDetails(blogId:any){
    return this.http.get(`${this.apiUrl}/admin/blog/get/${blogId}`);
  }

  changeBlogStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/blog/change-status`,{id:item_id, is_active:status});
  }

  saveBlogInfo(formData:any, files: File[])
  {
    const body = new FormData();
    body.append('destination_id', formData.destination_id);
    body.append('title', formData.title);
    body.append('content', formData.content);
    (formData.meta_title)?body.append('meta_title', formData.meta_title):'';
    (formData.meta_description)?body.append('id', formData.meta_description):'';
    (formData.meta_keywords)?body.append('id', formData.meta_keywords):'';
    (formData.meta_tags)?body.append('id', formData.meta_tags):'';
    (formData.id)?body.append('id', formData.id):'';
    (formData.banner_image)?body.append('banner_image', formData.banner_image):'';
    files.forEach((file, index) => {
      body.append('uploaded_files', file);
    });
    return this.http.post(`${this.apiUrl}/admin/blog/manage`, body);
  }

  deleteBlogImage(imageId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/blog/delete-image/${imageId}`);
  }

  updateBlogImageAlt(formData:any)
  {
    return this.http.patch<any>(`${this.apiUrl}/admin/blog/update-image-alt`, formData);
  }

  deleteBlogList(itemId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/blog/delete/${itemId}`);
  }

  autoPostBlog(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/blog/auto-post`, formData);
  }

  uploadDEditorImage(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/blog/upload-editor-image`, formData);

  }

   getEventList(formData:any)
  {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post(`${this.apiUrl}/admin/event/list`, formData, {headers});
  }

  getEventDetails(blogId:any){
    return this.http.get(`${this.apiUrl}/admin/event/get/${blogId}`);
  }

  changeEventStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/event/change-status`,{id:item_id, is_published:status});
  }

  saveEventInfo(formData:any, files: File[])
  {
    const body = new FormData();    
    body.append('title', formData.title);    
    (formData.short_description)?body.append('short_description', formData.short_description):'';
    (formData.content)?body.append('content', formData.content):'';    
    (formData.start_date)?body.append('start_date', formData.start_date):'';
    (formData.end_date)?body.append('end_date', formData.end_date):'';
    (formData.start_time)?body.append('start_time', formData.start_time):'';
    (formData.end_time)?body.append('end_time', formData.end_time):'';
    (formData.venue_name)?body.append('venue_name', formData.venue_name):'';
    (formData.address)?body.append('address', formData.address):'';
    (formData.city)?body.append('city', formData.city):'';
    (formData.state)?body.append('state', formData.state):'';
    (formData.country)?body.append('country', formData.country):'';
    (formData.meta_title)?body.append('meta_title', formData.meta_title):'';
    (formData.meta_description)?body.append('id', formData.meta_description):'';
    (formData.meta_keywords)?body.append('id', formData.meta_keywords):'';
    (formData.meta_tags)?body.append('id', formData.meta_tags):'';
    (formData.youtube_url)?body.append('youtube_url', formData.youtube_url):'';
    (formData.id)?body.append('id', formData.id):'';    
    files.forEach((file, index) => {
      body.append('uploaded_images', file);
    });
    return this.http.post(`${this.apiUrl}/admin/event/manage`, body);
  }

  deleteEventList(itemId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/event/delete/${itemId}`);
  }

  getFaqList(formData:any)
  {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post(`${this.apiUrl}/admin/faq/list`, formData, {headers});
  }

  changeFaqStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/faq/change-status`,{id:item_id, is_active:status});
  }

  addFaqList(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/faq/manage`, formData);
  }

  deleteFaq(itemId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/faq/delete/${itemId}`);
  }

  getQuotationList(formData:any)
  {
    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
    return this.http.post(`${this.apiUrl}/admin/quotation/list`, formData, {headers});
  }

  getQuotationDetails(quotationId:any){
    return this.http.get(`${this.apiUrl}/admin/quotation/get/${quotationId}`);
  }

  updateQuotation(formData:any, quotationId:any)
  {
    return this.http.put(`${this.apiUrl}/admin/quotation/update/${quotationId}`, formData);
  }

  sendQuotation(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/quotation/send-manual-quotation`, formData);
  }

  changePassword(formData:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/change-password`, formData);
  }

  testimonialLists(formData: any)
  {
    return this.http.post(`${this.apiUrl}/admin/testimonial/list`, formData);
  }

  addTestimonial(formData: any)
  {
    return this.http.post(`${this.apiUrl}/admin/testimonial/manage`, formData);
  }

  changeTestimonialStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/testimonial/change-status`,{id:item_id, is_active:status});
  }

  deleteTestimonial(listId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/testimonial/delete/${listId}`);
  }

  reviewLists(formData: any)
  {
    return this.http.post(`${this.apiUrl}/admin/tour-package-review/list`, formData);
  }

  faqLists(package_id: any)
  {
    return this.http.get(`${this.apiUrl}/admin/tour-package/get-packages/${package_id}`);
  }

  addTourpackageReview(formData: any, files: File[])
  {
    const body = new FormData();
    body.append('tour_package_id', formData.tour_package_id);
    body.append('rating', formData.rating);
    (formData.review_text)?body.append('review_text', formData.review_text):'';
    (formData.id)?body.append('id', formData.id):'';
    files.forEach((file, index) => {
      body.append('uploaded_files', file);
    });
    return this.http.post(`${this.apiUrl}/admin/tour-package-review/manage`, body);
  }

  addTourFaqList(formData:any)
  {    
    const faqs = [
      {
        "question": formData?.question,
        "answer": formData?.answer
      }
    ];
    const data = {
      id: formData?.id,
      tour_package_id: formData.tour_package_id,
      faqs: faqs
    }

    return this.http.post(`${this.apiUrl}/admin/tour-package/faqs-add`, data);
  }

  updateTourFaqList(formData:any)
  {
    const faqs = {
      "question": formData?.question,
      "answer": formData?.answer
    };

    return this.http.put(`${this.apiUrl}/admin/tour-package/faq-update/${formData?.id}`, faqs);
  }

  deleteTourFaqList(faqId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package/faq-delete/${faqId}`);
  }

  changeReviewStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/tour-package-review/change-status`,{id:item_id, is_active:status});
  }

  deleteReviewImage(imageId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package-review/delete-image/${imageId}`);
  }

  deleteReview(reviewId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package-review/delete/${reviewId}`);
  }

  seoMetaTags(formData: any)
  {
    return this.http.post(`${this.apiUrl}/admin/seo-metatags/list-seo-metatags`, formData);
  }

  addUpdateSeoMetaTags(formData: any)
  {
    return this.http.post(`${this.apiUrl}/admin/seo-metatags/manage-seo`, formData);
  }

  adminApiLogs(formData: any)
  {
    return this.http.get(`${this.apiUrl}/admin/monitor-api-log/today-list-admin`, formData);
  }

  webApiLogs(formData: any)
  {
    return this.http.get(`${this.apiUrl}/admin/monitor-api-log/today-list-web`, formData);
  }

  getUserLists(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/users/list`, formData);
  }

  changeUserStatus(item_id:any, status:any){
    return this.http.patch(`${this.apiUrl}/admin/users/change-status`,{user_id:item_id, is_active:status});
  }

  getUserLoginHistory(user_id:string, formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/users/get-login-history/${user_id}`, formData);
  }

  deleteActiivityImage(imageId:string)
  {
    return this.http.delete(`${this.apiUrl}/admin/tour-package/delete-activity-image/${imageId}`);
  }
  
  getBookingList(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/booking/list`, formData);
  }

  getBookingListSuccess(formData:any){
    return this.http.post(`${this.apiUrl}/admin/booking/success-payment-list`, formData);
  }

  getBookingListPartial(formData:any){
    return this.http.post(`${this.apiUrl}/admin/booking/partial-payment-list`, formData);
  }

  getBookingListFailed(formData:any){
    return this.http.post(`${this.apiUrl}/admin/booking/failed-payment-list`, formData);
  }

  getBookingListCompleted(formData:any){
    return this.http.post(`${this.apiUrl}/admin/booking/completed-booking-list`, formData);
  }

  sendQuotationPayment(fromData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/payment/send-quotation-payment-link`, fromData);
  }

  updatePaymentBooking(fromData:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/booking/update-payment-booking`, fromData);
  }

  cashPayment(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/payment/cash-deposit`, formData);
  }

  sendPaymentDueLink(payment_id:string)
  {
    return this.http.post(`${this.apiUrl}/admin/payment/send-payment-due-link/${payment_id}`, {});
  }

  duePaymentCashDeposit(payment_id:string)
  {
    return this.http.post(`${this.apiUrl}/admin/payment/due-payment-cash-deposit/${payment_id}`, {});
  }

  cancelQuotation(formData:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/quotation/cancel_quotation`, formData);
  }

  getPackageByDestination(destinationId:string)
  {
    return this.http.get(`${this.apiUrl}/admin/quotation/tour-package-list/${destinationId}`);
  }

  getPackageByPrice(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/quotation/get-tour-package-price`, formData);
  }
  
  getPackageWithPrice(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/quotation/get-package-details-with-price`, formData);
  }

  getAdminUserLists(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/admin-users/list`, formData);
  }

  changeAdminUserStatus(item_id:any, status:any){
    return this.http.patch(`${this.apiUrl}/admin/admin-users/change-status`,{user_id:item_id, is_active:status});
  }

  getAdminLoginHistory(user_id:string, formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/admin-users/get-login-history/${user_id}`, formData);
  }

  getMenuLists()
  {
    return this.http.get(`${this.apiUrl}/admin/menus/list-all`);
  }

  getRolePermissionListByUser(userId:string)
  {
    return this.http.get(`${this.apiUrl}/admin/role-permissions/list/${userId}`);
  }

  setRolePermission(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/role-permissions/bulk-manage`, formData);
  }

  paymentListAll(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/payment-history/list`, formData);
  }

  changeAdminUserPassword(formData:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/admin-users/change-password`, formData);
  }

  getQueryLeads(formData:any, status:string)
  {
    return this.http.post(`${this.apiUrl}/admin/query-lead/list-${status}-lead`, formData);
  }

  queryLeadChangeAction(formData:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/query-lead/change-action`, formData);
  }

  updateQuerylead(formData:any, quotation_id:string)
  {
    return this.http.patch(`${this.apiUrl}/admin/query-lead/modify-lead-send-quotation/${quotation_id}`, formData);
  }

  queryLeadStatus(quotation_id:string)
  {
    return this.http.get(`${this.apiUrl}/admin/query-lead/lead-action-status-list/${quotation_id}`)
  }

  sendInvoiceEmail(booking_id:string)
  {
    return this.http.get(`${this.apiUrl}/admin/booking/send-invoice-via-email/${booking_id}`)
  }

  sendInvoiceWhatsapp(booking_id:string)
  {
    return this.http.get(`${this.apiUrl}/admin/booking/send-invoice-via-whatsup/${booking_id}`)
  }

  getBookingServiceProviderType(formData:any)
  {
    return this.http.get(`${this.apiUrl}/admin/service-provider/master-list-type`);
  }

  getBookingServiceProviderList(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/service-provider/list`, formData);
  }

  manageServiceProvider(data: any)
  {
    const formData = new FormData();
    (data?.id)?formData.append('id', data.id):'';
    formData.append('destination_id', data.destination_id);
    formData.append('service_provider_type_id', data.service_provider_type_id);
    formData.append('provider_name', data.provider_name);
    (data.provider_email)?formData.append('provider_email', data.provider_email):'';
    formData.append('country_code', data.country_code);
    formData.append('provider_contact', data.provider_contact);
    (data.alternate_country_code)?formData.append('alternate_country_code', data.alternate_country_code):'';
    (data.provider_alternate_contact)?formData.append('provider_alternate_contact', data.provider_alternate_contact):'';
    (data.bank_account_number)?formData.append('bank_account_number', data.bank_account_number):'';   
    (data.bank_ifsc_code)?formData.append('bank_ifsc_code', data.bank_ifsc_code):'';
    (data.bank_account_holder_name)?formData.append('bank_account_holder_name', data.bank_account_holder_name):'';
    (data.upi_id)?formData.append('upi_id', data.upi_id):'';
    (data.description)?formData.append('description', data.description):'';    
    (data.bank_attachment)?formData.append('bank_attachment', data.bank_attachment):'';
    return this.http.post(`${this.apiUrl}/admin/service-provider/manage`, formData);
  }

  serviceProviderPayment(formData:FormData)
  {
    return this.http.post(`${this.apiUrl}/admin/service-provider/manage-service-provider-payment`, formData);
  }

  serviceProviderDuePayment(formData: FormData)
  {
    return this.http.post(`${this.apiUrl}/admin/service-provider/manage-service-provider-due-payment`, formData);
  }

  getServiceProviderList(destination_id:any, service_provider_type_id:any)
  {
    return  this.http.get(`${this.apiUrl}/admin/service-provider/list-all?destination_id=${destination_id}&service_provider_type_id=${service_provider_type_id}`)
  }

  getServiceProviderPaymentList(booking_id:any)
  {
    return this.http.get(`${this.apiUrl}/admin/service-provider/list/${booking_id}`);
  }

  changeServiceProviderStatus(formData:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/service-provider/change-status/`, formData)
  }

  getYoutuberList(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/promo-code/youtuber/list`, formData);
  }

  getYoutuberListAll()
  {
    return this.http.get(`${this.apiUrl}/admin/promo-code/youtuber/list-all`);
  }

  manageYoutuberList(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/promo-code/youtuber/manage`, formData);
  }

  changeYoutuiberStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/promo-code/youtuber/change-status`,{id:item_id, is_active:status});
  }

  getPromocodeTypes()
  {
    return this.http.get(`${this.apiUrl}/admin/promo-code/promo-code-type-list`);
  }

  getPromoCodeList(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/promo-code/list`, formData);
  }

  managePromocodeList(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/promo-code/manage`, formData);
  }

  changePromocodeStatus(item_id:any, status:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/promo-code/change-status`,{id:item_id, is_active:status});
  }

  getExpenseCategory()
  {
    return this.http.get(`${this.apiUrl}/admin/ledger/office-expense-categories`);
  }

  getOfficeExpenseList(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/ledger/office-expense/list`, formData);
  }

  manageOfficeExpense(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/ledger/manage-office-expense`, formData);
  }

  getLedgerList(formData:any)
  {
    return this.http.post(`${this.apiUrl}/admin/ledger/ledger-list`, formData);
  }

  quotationCallback(formData:any)
  {
    return this.http.patch(`${this.apiUrl}/admin/quotation/quotation-call-back`, formData)
  }
}
