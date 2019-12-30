import React, {Component} from 'react'

class EventsPage extends Component{
   
    constructor(){
        super();
        this.state = {
            isLoading: true,
            isFilterActive : false,
            events: null,
            error: null,
            filter : {
                _id: null,
                uuid: null,
                description: null,
                created_at: null,
                amount: null,
                currency: null,
                approvalStatus: []
            },
            defaultFilter : {
                _id: null,
                uuid: null,
                description: null,
                created_at: null,
                amount: null,
                currency: null,
                approvalStatus: ["Approved","Declined","Pending"]
            },
            sortingField : "approvalStatus",
            order : -1
        };
    }

    async handleSorting (sortBy) {
        await this.setState({sortingField: sortBy})
        this.componentDidMount()
       
      }

    async handleFilter (key,val) {
        let filterQuery = this.state.filter
        let approvalStatus = filterQuery.approvalStatus


        
       if (approvalStatus.includes(val))
       {
        approvalStatus = approvalStatus.filter(item => item !== val)

       }
       else{
        approvalStatus.push(val)
       }
       filterQuery.approvalStatus = approvalStatus
        await this.setState({
            isFilterActive : true,
            filter: filterQuery})
        console.log(this.state)
        
        this.componentDidMount()
       
      }

      async handleSortingOrder (order) {
        await this.setState({order: order})
        this.componentDidMount()
       
      }


    async componentDidMount(){
        this.getData()
        
    }

    getData =async () =>{
        var filterQuery = {}

        if(this.state.isFilterActive)
        {
            filterQuery = this.state.filter
        }
        else{
            filterQuery = this.state.defaultFilter
        }

        const requestBody = {
            
            query: `
            query{
                searchEvents(filter:{approvalStatus:${JSON.stringify(filterQuery.approvalStatus)},
                currency :${JSON.stringify(filterQuery.currency)},
                amount: ${JSON.stringify(filterQuery.amount)}},sort:{field:"${this.state.sortingField}",order:${this.state.order}}){
                  _id
                  uuid
                  employee{
                    uuid
                    first_name
                    last_name
                  }
                  created_at
                  currency
                  description
                  approvalStatus
                  amount
                  }
                }
            `
        }
        console.log(requestBody)

        const response = await fetch('http://localhost:4000/graphql',{
                                    method : 'POST',
                                    body: JSON.stringify(requestBody),
                                    headers: {
                                        'Content-Type' : 'application/json'
                                    }
                                })
        const data = await response.json()
        console.log(data.data.searchEvents)
        this.setState({events : data.data.searchEvents,
            isLoading: false})      
             
    }

    async updateData (id,status){
        const requestBody = {
            query: `
            mutation{
                updateEvent(_id:"${id}",approvalStatus: ${status})
                {
                _id
                uuid
                employee
                  {
                  uuid
                  first_name
                  last_name
                    }
                created_at
                currency
                description
                approvalStatus
                
              }
               
              }
            `
        }
        console.log(requestBody)

        const response = await fetch('http://localhost:4000/graphql',{
                                    method : 'POST',
                                    body: JSON.stringify(requestBody),
                                    headers: {
                                        'Content-Type' : 'application/json'
                                    }
                                })
                                this.componentDidMount()
             
             
    }



    

    render(){  
  return (
      <div class="container">
        <div class="row">

            <div class="col-md-12">
                <div class="grid search">
                    <div class="grid-body">
                        <div class="row">

                             
                        <div class="col-md-3">
                        <h2 class="grid-title"><i class="fa fa-filter"></i> Filters</h2>
                 
                        
                
                        <h4>By category:</h4>
                        
                        <div class="checkbox">
                            <label><input type="checkbox" class="icheck" onChange={() => {
                                this.state.isLoading = true
                                this.handleFilter("approvalStatus","Approved")
                            }}/> Approved</label>
                        </div>
                        <div class="checkbox">
                            <label><input type="checkbox" class="icheck" onChange={() => {
                                this.state.isLoading = true
                                this.handleFilter("approvalStatus","Declined")
                            }}/> Declined</label>
                        </div>
                        <div class="checkbox">
                            <label><input type="checkbox" class="icheck" onChange={() => {
                                this.state.isLoading = true
                                this.handleFilter("approvalStatus","Pending")
                            }}/> Pending</label>
                        </div>

                
                        <div class="padding"></div>

                        <h4>By currency</h4>
                        
                        <div class="input-group" >
                            <input type="text" class="form-control"/> 
                           
                            <span class="input-group-btn">
                            <button type="button" class="btn btn-secondary">Add</button>
                            </span>

                           
                      
                        </div>
                        
                        <div class="padding"></div>
                    
                        <h4>By date:</h4>
                        From
                        <div class="input-group date form_date" data-date="2014-06-14T05:25:07Z" data-date-format="dd-mm-yyyy" data-link-field="dtp_input1">
                            <input type="text" class="form-control"/> 
                            <span class="input-group-addon bg-blue"><i class="fa fa-th"></i></span>
                        </div>
                        <input type="hidden" id="dtp_input1" value=""/>
                        
                        To
                        <div class="input-group date form_date" data-date="2014-06-14T05:25:07Z" data-date-format="dd-mm-yyyy" data-link-field="dtp_input2">
                            <input type="text" class="form-control"/>
                            <span class="input-group-addon bg-blue"><i class="fa fa-th"></i></span>
                        </div>
                        <input type="hidden" id="dtp_input2" value=""/>
               
                        
                        <div class="padding"></div>
                        
                   
                        <h4>By price:</h4>
                        Between <div id="price1">$300</div> to <div id="price2">$800</div>
                        <div class="slider-primary">
                        <div class="slider slider-horizontal" style={{width: "152px"}}>
                        <div class="slider-track"><div class="slider-selection" style={{left: "30%", width: "50%"}}>
                        </div><div class="slider-handle round" style={{left: "30%"}}>
                        </div><div class="slider-handle round" style={{left: "80%"}}>
                        </div></div><div class="tooltip top hide" style={{top: "-30px", left: "50.1px"}}>
                        <div class="tooltip-arrow"></div><div class="tooltip-inner">300 : 800</div>
                            
                            </div>
                            <input type="text" class="slider" value="" data-slider-min="0" data-slider-max="1000" data-slider-step="1" data-slider-value="[300,800]" data-slider-tooltip="hide"/>
                            
                            </div>
                        </div>
            
                    </div>
      
          
                    <div class="col-md-9">
                        <h2><i class="fa fa-file-o"></i> Expences</h2>

            
                      
					
			
						<div class="input-group">
							<input type="text" class="form-control" placeholder="Search by Expense ID or Name"/>
							<span class="input-group-btn">
								<button class="btn btn-primary" type="button"><i class="fa fa-search"></i></button>
							</span>
						</div>
                    
                      
                        
                        <div class="padding"></div>
                        
                        <div class="row">
       
                            <div class="col-sm-6">
                                <div class="btn-group">
                                <div class="dropdown">
                                <button class="btn btn-outline-dark dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  Sort by
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                  <button class="dropdown-item" type="button" onClick={() => {
                                    this.state.isLoading = true
                                    this.handleSorting("approvalStatus")
                                }}>Approval status</button>
                                  <button class="dropdown-item" type="button"onClick={() => {
                                    this.state.isLoading = true
                                    this.handleSorting("employee.first_name")
                                }}>Employee name</button>
                                  <button class="dropdown-item" type="button"onClick={() => {
                                    this.state.isLoading = true
                                    this.handleSorting("created_at")
                                }}>Creation date</button>
                                  <button class="dropdown-item" type="button"onClick={() => {
                                    this.state.isLoading = true
                                    this.handleSorting("amount")
                                }}>Expense amount</button>
                                </div>
                              </div>
                                </div>
                                
                            </div>
      
                            
                            <div class="col-md-6 text-right">
                            
                            
                            <h2 class="grid-title">

                            <div class="btn-group">
                            <div class="dropdown">
                            <button class="btn btn-outline-dark dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.order == -1 ? "Descending" : "Ascending"}
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                              <button class="dropdown-item" type="button" onClick={() => {
                                this.state.isLoading = true
                                this.handleSortingOrder(1)
                            }}>Ascending</button>
                              <button class="dropdown-item" type="button"onClick={() => {
                                this.state.isLoading = true
                                this.handleSortingOrder(-1)
                            }}>Descending</button>
                             
                            </div>
                          </div>
                            </div>
                            
                             </h2>
                                
                            
                               
                                
                            </div>
                        </div>
                        
  
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <tbody><tr>
                                    
                                </tr>




        <div >
        {this.state.loading || !this.state.events ? (
            
         <div  className="d-flex justify-content-center align-items-center" >
         <div class="spinner-border" role="status"> 
              <span class="sr-only">Loading</span> 
          </div> 
          </div>
      
        ):
          this.state.events.map((item)=>
          
          <div class="card text-center shadow-lg bg-white">
              <div class="card-header">
              Expence ID:  {item.uuid}
              </div>
              <div class="card-body">
                  <h5 class="card-title"> {item.employee.first_name}  {item.employee.last_name}</h5>
                
                      <p class="card-text">Description : {item.description}</p>
                      <p class="card-text">Amount : {item.amount}</p>
                      <p class="card-text">Currency : {item.currency}</p>
                      <p className="App-clock">
                       Created at: {item.created_at}.
                      </p>
                      <div>
                          {item.approvalStatus === 'Pending' ? 
                          (<div>
                          <button class="btn btn-outline-success mr-3" type="button" onClick={() => {
                              this.state.isLoading = true
                              this.updateData(item._id,"Approved")
                          }}>Approve</button>  
                           <button class="btn btn-outline-danger mr-3" type="button" onClick={() =>{ 
                              this.state.isLoading = true
                               this.updateData(item._id,"Declined")}
                              }>Decline</button>
                          </div>
                          )
                          : 
                          (<div class="float-right">
                          {item.approvalStatus === 'Approved' ? 
                          <span class="stamp is-approved">Approved</span> :
                          <span class="stamp is-nope">Declined</span> 
                      }
                          
                          </div>)
                      }
                      </div>
                      
                      
                      
                  
              </div>
          </div>
             
          ) }
      </div>
                                <tr>
                                
                            
                                    
                                </tr>
                            </tbody></table>
                        </div>
                
                        <ul class="pagination">
                            <li class="disabled"><a href="#">«</a></li>
                            <li class="active"><a href="#">1</a></li>
                            <li><a href="#">2</a></li>
                            <li><a href="#">3</a></li>
                            <li><a href="#">4</a></li>
                            <li><a href="#">5</a></li>
                            <li><a href="#">»</a></li>
                        </ul>
             
                        </div>
    
                
                
                  </div>
                  </div>
                  </div>
                  </div>
                  </div>
                  
        </div>
























  );
           
    }
}

export default EventsPage