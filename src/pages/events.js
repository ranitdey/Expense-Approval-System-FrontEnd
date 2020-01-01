import React, {Component} from 'react'
// import DateTimePicker from 'react-datetime-picker';
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import 'react-widgets/dist/css/react-widgets.css';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';


class EventsPage extends Component{
   
    constructor(){
        
        Moment.locale();
        momentLocalizer();
        super();
        this.state = {
            isLoading: true,
            isFilterActive: false,
            isApprovalFilterActive : false,
            isDateFilterActive : false,
            events: null,
            error: null,
            filter : {
                _id: null,
                uuid: null,
                description: null,
                startingDate: null,
                endingDate: null,
                minAmount: null,
                maxAmount: null,
                currency: null,
                approvalStatus:  ["Approved","Declined","Pending"],
               
            },
            defaultFilter : {
                _id: null,
                uuid: null,
                description: null,
                startingDate: null,
                endingDate: null,
                minAmount: null,
                maxAmount: null,
                currency: null,
                approvalStatus: ["Approved","Declined","Pending"],
    
            },
            sortingField : "approvalStatus",
            order : -1,
           
            
        };
       
            
          
    }

    async applyFilter(){
        
       
        await this.setState({isFilterActive: !this.state.isFilterActive,
          
        }) 
        this.componentDidMount()

    }

    minFilterAmountHandler= evt=> {
        let filterQuery = this.state.filter
        if (evt.target.value === "") {
            filterQuery.minAmount = null
            
        }
        else{
           
        filterQuery.minAmount = evt.target.value
     

        }
        this.setState({filter: filterQuery})
        
    
}

maxFilterAmountHandler= evt=> {
    let filterQuery = this.state.filter

    if (evt.target.value === "") {
    
    filterQuery.maxAmount = null
   
    }
    else{
        filterQuery.maxAmount = evt.target.value

    }
    this.setState({filter: filterQuery}) 

}


filterByIdHandler= evt=>{
    let filterQuery = this.state.filter
    if (evt.target.value === "") {
        
 
    filterQuery._id = null
     
    }
    else{
        filterQuery._id = evt.target.value

    }
    this.setState({
        filter : filterQuery})
      

}

    


     fromDateFilterHandler= date=> {
        let filterQuery = this.state.filter
        filterQuery.startingDate = date
        
         this.setState({ filter: filterQuery,
            isDateFilterActive: true
       })
   
        console.log(this.state.filter.startingDate)
     
    
}

toDateFilterHandler =date=> {
    let filterQuery = this.state.filter
    filterQuery.endingDate = date
     this.setState({ filter: filterQuery,
        isDateFilterActive: true
         })
    
        console.log(this.state.filter.endingDate)
      
      
    
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
            isApprovalFilterActive : true,
            filter: filterQuery})
        console.log(this.state)
        
      
       
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
                startingDate : "${filterQuery.startingDate}",
                endingDate : "${filterQuery.endingDate}",
                minAmount : ${filterQuery.minAmount},
                maxAmount : ${filterQuery.maxAmount},
                _id : "${filterQuery._id}",
                currency :${JSON.stringify(filterQuery.currency)}},sort:{field:"${this.state.sortingField}",order:${this.state.order}}){
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
                        <h2 class="grid-title"><i class={this.state.isFilterActive ? "fa fa-filter redGlow" : "fa fa-filter" }></i> Filters</h2>
                 
                        
                
                        <h4>By Category:</h4>
                        
                        <div class="checkbox">
                            <label><input type="checkbox"   class="icheck" onChange={() => {
                             
                                this.handleFilter("approvalStatus","Approved")
                            }}
                            disabled={ this.state.isFilterActive ? "disable" : "" } defaultChecked /> Approved</label>
                        </div>
                        <div class="checkbox">
                            <label><input type="checkbox"  class="icheck" onChange={() => {
                     
                                this.handleFilter("approvalStatus","Declined")
                            }}
                            disabled={ this.state.isFilterActive ? "disable" : "" } defaultChecked/> Declined</label>
                        </div>
                        <div class="checkbox">
                            <label><input type="checkbox"  class="icheck" onChange={() => {
                    
                                this.handleFilter("approvalStatus","Pending")
                            }}
                            disabled={ this.state.isFilterActive ? "disable" : "" } defaultChecked/> Pending</label>
                        </div>

                
                        <div class="padding"></div>

                        <h4>By Amount:</h4>
                        
                        <div class="input-group" >
                        <div class="row">
                        <div class="col">
                          <input type="text" class="form-control" placeholder="From" onChange={this.minFilterAmountHandler} 
                          disabled={ this.state.isFilterActive ? "disable" : "" }/>
                        </div>
                        <div class="col">
                          <input type="text" class="form-control" placeholder="To" onChange={this.maxFilterAmountHandler}
                          disabled={ this.state.isFilterActive ? "disable" : "" }/>
                        </div>
                      </div>
                           
                            <span class="input-group-btn">
                           
                            </span>

                           
                      
                        </div>
                        
                        <div class="padding"></div>
                    
                        <h4 className="top-buffer">By Date:</h4>
                        
                 
                   
                        <div>
                        <DateTimePicker className='form-group' placeholder="From"
                        
                        onSelect={value => this.fromDateFilterHandler(Moment.utc(value).toISOString())}
                        disabled={ this.state.isFilterActive ? "disable" : "" }
                        />
                        </div>
                  
                        <div>
                        <DateTimePicker className='form-group' placeholder="To"
                       
                        onSelect={value => this.toDateFilterHandler( Moment.utc(value).toISOString())}
                        disabled={ this.state.isFilterActive ? "disable" : "" }
                        />
                        </div>

                        <div class="padding"></div>
                    
                        <h4 className="top-buffer">By Expense ID:</h4>
                        
                      
                   
                        <div>
                        <input type="text" class="form-control" placeholder="Expense Id" onChange={this.filterByIdHandler} 
                          disabled={ this.state.isFilterActive ? "disable" : "" }/>
                        </div>
                       



                        
                       
               
                        
                        
                   
                        
                        
                            
                        <div class="form-group top-buffer">
                    

                        <button type="button" class={this.state.isFilterActive ? "btn btn-danger" : "btn btn-primary " }onClick={() => {
                            this.state.isLoading = true
                            this.applyFilter()
                        }}>{this.state.isFilterActive ? "Reset" : "Apply"}</button>
                    </div>
                        

                       
            
                    </div>
                    
                    
      
          
                    <div class="col-md-9">
                        <h2><i class="fa fa-file-o"></i> Expences</h2>

            
                      
					
			

                    
                      
                        
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
              Expence ID:  {item._id}
              </div>
              <div class="card-body">
                  <h5 class="card-title"> {item.employee.first_name}  {item.employee.last_name}</h5>
                
                      <p class="card-text">Description : {item.description}</p>
                      <p class="card-text">Amount : {item.amount}</p>
                      <p class="card-text">Currency : {item.currency}</p>
                      <p className="App-clock">
                       Created at: {Moment(item.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}.
                      </p>
                      <div>
                          {item.approvalStatus === 'Pending' ? 
                          (<div>
                          <button class="btn btn-outline-success mr-3" type="button" data-toggle="modal" data-target="#approveModal" >Approve</button>  

                          <div class="modal fade" id="approveModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog" role="document">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="approveModalLabel">Confirm your action!</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                         Do you want to approve the expense?
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={() => {
                                            this.state.isLoading = true
                                            this.updateData(item._id,"Approved")
                                        }}>Proceed</button>
                                    </div>
                                    </div>
                                </div>
                                </div>
                           <button class="btn btn-outline-danger mr-3" type="button" data-toggle="modal" data-target="#declineModal"  >Decline</button>
                           <div class="modal fade" id="declineModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                              <div class="modal-dialog" role="document">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title" id="declineModalLabel">Confirm your action!</h5>
                                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div class="modal-body">
                                   Do you want to decline the expense?
                                </div>
                                <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                  <button type="button" class="btn btn-primary" data-dismiss="modal" onClick={() =>{ 
                                    this.state.isLoading = true
                                     this.updateData(item._id,"Declined")}
                                    }>Proceed</button>
                                </div>
                              </div>
                            </div>
                            </div>
                          
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