1. What columns violate 1NF?

member_address, food_code, and food_description (non-atomic or composite values) and dinner_date (inconsistent data type).

2. What entities do you recognize that could be extracted?

- Members
- Dinners
- Food Items
- Venues

3. Name all the tables and columns that would make a 3NF compliant solution.

- members (member_id [PK], member_name, member_street, member_house)
- dinners (dinner_id [PK], dinner_date, venue_code [FK references venues])
- food (food_code [PK], food_description)
- venues (venue_code [PK], venue_description)
- dinner_food (dinner_id [FK references dinners], food_code [FK references food]) - junction table for many-to-many relationship between dinners and food.
- member_dinner (member_id [FK references members], dinner_id [FK references dinners]) - junction table for the many-to-many relationship between members and dinners.
