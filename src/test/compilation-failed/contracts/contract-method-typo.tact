contract Test {
    storage: Int;
    
    init() {
        self.storage = 0;
    }
    
    fun increment() {
        self.storage = self.storage + 1;
    }
    
    fun test() {
        self.incremen1(); // Should suggest "increment"
    }
    
    receive() {}
}