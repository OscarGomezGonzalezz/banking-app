'''
stateDiagram
    [*] --> Start
    Start --> Authentication : Open app
    Authentication --> MainDashboard : Successful login
    MainDashboard --> TransferMoney : User selects transfer
    TransferMoney --> Confirmation : User enters details
    Confirmation --> MainDashboard : Transfer successful
    MainDashboard --> ViewExpenses : User selects to view monthly expenses
    ViewExpenses --> MainDashboard : User returns to dashboard
    MainDashboard --> [*] : User logs out
'''
